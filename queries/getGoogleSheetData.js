// services/getGoogleSheetData.js
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { getSpreadsheetData } from "./getSpreadsheetData";

export async function getGoogleSheetData() {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth();
    const gsapi = google.sheets({ version: "v4", auth: client });

    let deals = [];
    let resources = [];

    // Loop through sheet names and fetch data
    for (const sheetName of sheetNames) {
      const opt = {
        spreadsheetId,
        range: `${sheetName}`, // Fetch all data in each sheet
      };

      try {
        // Try to fetch data from the Google Sheet
        const response = await gsapi.spreadsheets.values.get(opt);
        const rows = response.data.values;

        if (!rows || !rows.length) {
          continue;
        }

        // Process the rows into a structured format with unique UUIDs
        const headers = rows[0]; // First row is headers

        const data = rows.slice(1).map((row) => {
          let rowData = { id: uuidv4() }; // Add a unique UUID

          headers.forEach((header, colIndex) => {
            rowData[header] = row[colIndex] || ""; // Store the cell's value or an empty string
          });

          return rowData;
        });

        // Dynamically check against the tab names from the database
        if (sheetName.toLowerCase() === sheetNames[0].toLowerCase()) {
          deals = data;
        } else if (sheetName.toLowerCase() === sheetNames[1].toLowerCase()) {
          resources = data;
        }
      } catch (sheetError) {
        if (sheetError.code === 403) {
          return {
            status: 403,
            error: true,
            message: "You do not have permission to access this sheet.",
          };
        } else if (sheetError.code === 404) {
          return {
            status: 404,
            error: true,
            message: `Sheet "${sheetName}" not found.`,
          };
        } else if (
          sheetError.code === "ENOTFOUND" ||
          sheetError.code === "ETIMEDOUT"
        ) {
          return {
            status: 503,
            error: true,
            message:
              "Google Sheets API is currently unreachable. Please check your connection or try again later.",
          };
        } else {
          return {
            status: 400,
            error: true,
            message: `Error fetching data from sheet "${sheetName}": ${sheetError.message}`,
          };
        }
      }
    }

    return { status: 200, data: { deals, resources } };
  } catch (e) {
    if (e.code === "ENOTFOUND" || e.code === "ETIMEDOUT") {
      return {
        status: 503,
        error: true,
        message:
          "Google Sheets API is currently unreachable. Please check your connection or try again later.",
      };
    }
    console.error("Error fetching Google Sheets data:", e.message);
    return {
      status: 500,
      error: true,
      message: "An internal error occurred. Please try again later.",
    };
  }
}
