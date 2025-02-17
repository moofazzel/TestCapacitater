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
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Find the sheet named "resources" (case-insensitive)
    const sheetName = sheetNames?.[1];

    if (!sheetName) {
      return {
        status: 404,
        error: true,
        message: '"Resources" sheet not found in the spreadsheet.',
      };
    }

    // Fetch all data from the "resources" sheet
    const opt = {
      spreadsheetId,
      range: `${sheetName}`,
    };
    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    if (!rows || !rows.length) {
      return { status: 200, data: { resources: [] } };
    }

    // Pull headers from the first row
    const headers = rows[0];

    // Map the required fixed fields to their indices
    const resourceIndex = headers.indexOf("Resources");
    const totalMaxCapacityIndex = headers.indexOf("Total Max Capacity(%)");
    const dateHiredIndex = headers.indexOf("Date Hired");
    const categoryIndex = headers.indexOf("Category");

    // Locate the first column that contains "Deal ID" (if not found, use the end of the row)
    let firstDealIdIndex = headers.findIndex(
      (header) => header && header.includes("Deal ID")
    );
    if (firstDealIdIndex === -1) {
      firstDealIdIndex = headers.length;
    }

    // Determine custom column headers that lie between "Category" and the first "Deal ID" column.
    const customColumnHeaders = headers.slice(
      categoryIndex + 1,
      firstDealIdIndex
    );

    // Structure the data, including both fixed fields and any custom fields.
    const resources = rows.slice(1).map((row) => {
      const resourceObj = {
        id: uuidv4(), // Unique identifier for each resource
        resource: row[resourceIndex] || "",
        totalMaxCapacity: row[totalMaxCapacityIndex] || "",
        dateHired: row[dateHiredIndex] || "",
        category: row[categoryIndex] || "",
      };

      // Add each custom field into the resource object.
      customColumnHeaders.forEach((colHeader, idx) => {
        // Calculate the actual index in the row: starts right after "Category".
        const colIndex = categoryIndex + 1 + idx;
        resourceObj[colHeader] = row[colIndex] || "";
      });

      return resourceObj;
    });

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
