"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function addResourceToSheet(formData) {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames, email } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Specify the "resources" sheet name directly
    const sheetName = sheetNames[1]; // Ensure this matches your sheet name

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

    // Define the new resource object based on form data.
    // Note: The keys here do not necessarily match the header names.
    // We'll map them to the headers below.
    const newResource = {
      resourceName: formData.get("resourceName"),
      totalMaxCapacity: formData.get("totalMaxCapacity"),
      dateHired: formattedHireDate,
      category: formData.get("category"),
    };

    // Check if the resource already exists.
    // Assumes the "Resources" column is the first column in the sheet.
    const resourceExists = rows.some(
      (row) => row[0] === newResource.resourceName
    );
    if (resourceExists) {
      return {
        status: 409,
        message:
          "The resource must be unique as it already exists in the sheet.",
      };
    }

    // Build the new row by matching each header:
    // For fixed headers, use the appropriate value from newResource.
    // For any other header, try to get a value from formData (or use an empty string).
    const newRow = headers.map((header) => {
      const trimmedHeader = header.trim();
      if (trimmedHeader === "Resources") {
        return newResource.resourceName;
      }
      if (trimmedHeader === "Total Max Capacity(%)") {
        return newResource.totalMaxCapacity;
      }
      if (trimmedHeader === "Date Hired") {
        return newResource.dateHired;
      }
      if (trimmedHeader === "Category") {
        return newResource.category;
      }
      // For any additional (dynamic) column, attempt to fetch a matching value from formData.
      // This assumes the form field names for dynamic fields match the header names.
      return formData.get(trimmedHeader) || "";
    });

    // Append the new row to the sheet.
    // We use the full range based on the header length.
    const appendOptions = {
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    };

    await gsapi.spreadsheets.values.append(appendOptions);

    return {
      status: 200,
      message: "Resource successfully added to the sheet",
    };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
