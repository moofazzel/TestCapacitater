"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function updateResourceToSheet(formData) {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth();
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Specify the "resources" sheet name directly
    const sheetName = sheetNames[1]; // Ensure this matches the sheet name in your Google Sheets

    // Fetch the sheet data
    const opt = {
      spreadsheetId,
      range: `${sheetName}`,
    };

    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    // Format the hire date full month name
    const hireDate = new Date(formData.get("hireDate"));
    const formattedHireDate = `${hireDate.getDate()} ${hireDate.toLocaleString(
      "en-US",
      { month: "long" }
    )} ${hireDate.getFullYear()}`;

    // Extract data from the form
    const updatedResource = {
      resourceName: formData.get("resourceName"),
      totalMaxCapacity: formData.get("totalMaxCapacity"),
      dateHired: formattedHireDate,
      category: formData.get("category"),
    };

    // Find the row index of the resource
    const resourceRowIndex = rows.findIndex(
      (row) => row[0] === updatedResource.resourceName
    );

    if (resourceRowIndex === -1) {
      return { status: 404, message: "Resource not found" };
    }

    // Update the resource fields in the found row
    rows[resourceRowIndex][1] = updatedResource.totalMaxCapacity;
    rows[resourceRowIndex][2] = updatedResource.dateHired;
    rows[resourceRowIndex][3] = updatedResource.category;

    // Write the updated row back to the sheet
    const updateOptions = {
      spreadsheetId,
      range: `${sheetName}!A${resourceRowIndex + 1}:D${resourceRowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [rows[resourceRowIndex]],
      },
    };

    await gsapi.spreadsheets.values.update(updateOptions);

    return { status: 200, message: "Resource successfully updated" };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
