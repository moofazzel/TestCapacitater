"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function updateResourceToSheet(formData) {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames, email } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Specify the "resources" sheet name directly
    const sheetName = sheetNames[1]; // Ensure this matches the sheet name in your Google Sheets

    // Fetch the sheet data (including headers)
    const opt = {
      spreadsheetId,
      range: `${sheetName}`,
    };
    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    if (!rows || !rows.length) {
      throw new Error("No data found in the sheet.");
    }

    // The first row is the header row.
    const headers = rows[0];

    // Format the hire date with full month name
    const hireDate = new Date(formData.get("hireDate"));
    const formattedHireDate = `${hireDate.getDate()} ${hireDate.toLocaleString(
      "en-US",
      { month: "long" }
    )} ${hireDate.getFullYear()}`;

    // Define the updated resource object based on form data
    const updatedResource = {
      resourceName: formData.get("resourceName"),
      totalMaxCapacity: formData.get("totalMaxCapacity"),
      dateHired: formattedHireDate,
      category: formData.get("category"),
    };

    // Find if the resource exists based on resourceName (assuming it's in the first column).
    const resourceRowIndex = rows.findIndex(
      (row) => row[0] === updatedResource.resourceName
    );

    if (resourceRowIndex === -1) {
      return {
        status: 404,
        message: "Resource not found in the sheet.",
      };
    }

    // Build the updated row by matching each header:
    const updatedRow = headers.map((header) => {
      const trimmedHeader = header.trim();
      if (trimmedHeader === "Resources") {
        return updatedResource.resourceName;
      }
      if (trimmedHeader === "Total Max Capacity(%)") {
        return updatedResource.totalMaxCapacity;
      }
      if (trimmedHeader === "Date Hired") {
        return updatedResource.dateHired;
      }
      if (trimmedHeader === "Category") {
        return updatedResource.category;
      }
      // For any additional (dynamic) column, attempt to fetch a matching value from formData
      return formData.get(trimmedHeader) || "";
    });

    // Update the row in the sheet
    const updateOptions = {
      spreadsheetId,
      range: `${sheetName}!A${resourceRowIndex + 1}:${String.fromCharCode(
        65 + headers.length - 1
      )}${resourceRowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [updatedRow],
      },
    };

    await gsapi.spreadsheets.values.update(updateOptions);

    return {
      status: 200,
      message: "Resource successfully updated in the sheet",
    };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
