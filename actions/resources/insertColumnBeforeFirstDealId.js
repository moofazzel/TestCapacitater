"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

/**
 * Inserts a new custom column between the "Category" column and the default "Deal ID 1" column.
 * Users can add at most three custom columns.
 *
 * Default columns (by index):
 * 0: Resources
 * 1: Total Max Capacity(%)
 * 2: Date Hired
 * 3: Category
 * 4: Deal ID 1
 * 5: Deal Capacity 1(%)
 * 6: Deal ID 2
 * 7: Deal Capacity 2(%)
 * 8: Deal ID 3
 * 9: Deal Capacity 3(%)
 *
 * @param {string} newColumnName - The header name for the new custom column.
 * @returns {Promise<Object>} - Returns an object with status and message.
 */

export async function insertColumnBeforeFirstDealId(newColumnName) {
  try {
    // Retrieve spreadsheet info and user email
    const { spreadsheetId, sheetNames, email } = await getSpreadsheetData();
    // Assume the target sheet is the second sheet (adjust as needed)
    const sheetName = sheetNames[1];

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Fetch the entire sheet (assume header is the first row)
    const response = await gsapi.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in the sheet.");
    }
    const headerRow = rows[0];

    // Locate the "Category" column (case-insensitive exact match)
    const categoryIndex = headerRow.findIndex(
      (cell) => cell && cell.trim().toLowerCase() === "category"
    );
    if (categoryIndex === -1) {
      throw new Error('The "Category" column was not found in the header.');
    }

    // Locate the default "Deal ID 1" column (exact match is assumed)
    const dealId1Index = headerRow.findIndex(
      (cell) => cell && cell.trim() === "Deal ID 1"
    );
    if (dealId1Index === -1) {
      throw new Error('The "Deal ID 1" column was not found in the header.');
    }

    // Determine the count of custom columns already inserted between Category and Deal ID 1.
    // They are assumed to be any columns between (categoryIndex + 1) and dealId1Index.
    const customColumnCount = dealId1Index - (categoryIndex + 1);

    // Validate that a maximum of 3 custom columns have not been exceeded.
    if (customColumnCount >= 3) {
      return {
        status: 400,
        error: true,
        message: "Maximum number of custom Data Fields (3) already added.",
      };
    }

    // Calculate the insertion index.
    // If no custom column exists, the new column goes right after "Category" (i.e. at categoryIndex + 1).
    // Otherwise, it is inserted after the last custom column.
    const insertionIndex = categoryIndex + 1 + customColumnCount;

    // Insert the new column header into the header row.
    headerRow.splice(insertionIndex, 0, newColumnName);

    // Update the header row in the sheet.
    await gsapi.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [headerRow] },
    });

    // Update each subsequent row by inserting an empty cell at the same insertion index.
    for (let i = 1; i < rows.length; i++) {
      // Ensure the row has enough cells before the insertion index.
      while (rows[i].length < insertionIndex) {
        rows[i].push("");
      }
      rows[i].splice(insertionIndex, 0, ""); // Insert an empty cell.
      await gsapi.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${i + 1}`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [rows[i]] },
      });
    }

    return {
      status: 200,
      message: `New Data Field "${newColumnName}" successfully added".`,
    };
  } catch (error) {
    console.error(error);
    return { status: 400, error: true, message: error.message };
  }
}
