"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function deleteResourceFromSheet(resourceName) {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames, email } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Specify the "resources" sheet name directly
    const sheetName = sheetNames[1]; // Ensure this matches the sheet name in your Google Sheets

    // Get the sheet ID for the "sheet name/resources" sheet
    const spreadsheet = await gsapi.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = spreadsheet.data.sheets.find(
      (s) => s.properties.title === sheetName
    );

    if (!sheet) {
      return { status: 404, message: "Resources sheet not found" };
    }

    const sheetId = sheet.properties.sheetId;

    // Fetch the sheet data to find the row index of the resource
    const opt = {
      spreadsheetId,
      range: sheetName,
    };

    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    // Find the row index of the resource to delete
    const resourceRowIndex = rows.findIndex((row) => row[0] === resourceName);

    if (resourceRowIndex === -1) {
      return { status: 404, message: "Resource not found" };
    }

    // The row to delete (in A1 notation)
    const rowToDelete = resourceRowIndex + 1;

    // Delete the row
    await gsapi.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowToDelete - 1, // API uses zero-based index
                endIndex: rowToDelete,
              },
            },
          },
        ],
      },
    });

    return { status: 200, message: "Resource successfully deleted" };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
