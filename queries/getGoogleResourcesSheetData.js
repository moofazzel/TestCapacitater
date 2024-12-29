import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { getSpreadsheetData } from "./getSpreadsheetData";

export const dynamic = "force-dynamic";

export async function getGoogleResourcesSheetData() {
  try {
    // Fetch spreadsheet info from User in DB
    const { email, spreadsheetId, sheetNames } = await getSpreadsheetData();

    if (!spreadsheetId || !sheetNames || sheetNames.length < 2) {
      return {
        status: 400,
        error: true,
        message: "Spreadsheet or resources sheet name not found.",
      };
    }

    // Authenticate with Google Sheets API
    const client = await googleAuth(email); // Updated to use email for authentication
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Ensure the second sheet matches "resources"
    const sheetName = sheetNames.find(
      (name) => name.toLowerCase() === "resources"
    );

    if (!sheetName) {
      return {
        status: 404,
        error: true,
        message: '"Resources" sheet not found in the spreadsheet.',
      };
    }

    // Fetch data from the "resources" sheet
    const opt = {
      spreadsheetId,
      range: `${sheetName}`, // Fetch all data in the "resources" sheet
    };

    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    if (!rows || !rows.length) {
      return { status: 200, data: { resources: [] } };
    }

    // Pull headers from the first row
    const headers = rows[0];

    // Map the required fields to their indices
    const resourceIndex = headers.indexOf("Resources");
    const totalMaxCapacityIndex = headers.indexOf("Total Max Capacity(%)");
    const dateHiredIndex = headers.indexOf("Date Hired");
    const categoryIndex = headers.indexOf("Category");

    // Structure the data to keep only the required fields
    const resources = rows.slice(1).map((row) => ({
      id: uuidv4(), // Adding a unique UUID
      resource: row[resourceIndex] || "",
      totalMaxCapacity: row[totalMaxCapacityIndex] || "",
      dateHired: row[dateHiredIndex] || "",
      category: row[categoryIndex] || "",
    }));

    return { status: 200, data: { resources } };
  } catch (error) {
    // Handle specific Google API errors
    if (error.code === 403) {
      return {
        status: 403,
        error: true,
        message: "You do not have permission to access this sheet.",
      };
    } else if (error.code === 404) {
      return {
        status: 404,
        error: true,
        message: "The requested sheet was not found.",
      };
    } else if (error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      return {
        status: 503,
        error: true,
        message:
          "Google Sheets API is currently unreachable. Please check your connection and try again later.",
      };
    } else {
      return {
        status: 400,
        error: true,
        message: `Error fetching resources: ${error.message}`,
      };
    }
  }
}
