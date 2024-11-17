"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function addResourceToSheet(formData) {
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

    // Define the new resource object
    const newResource = {
      resourceName: formData.get("resourceName"),
      totalMaxCapacity: formData.get("totalMaxCapacity"),
      dateHired: formattedHireDate,
      category: formData.get("category"),
    };

    // Check if the resource already exists
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

    // If the resource does not exist, append it
    const newRow = [
      newResource.resourceName,
      newResource.totalMaxCapacity,
      newResource.dateHired,
      newResource.category,
    ];

    const appendOptions = {
      spreadsheetId,
      range: `${sheetName}!A:D`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    };

    await gsapi.spreadsheets.values.append(appendOptions);

    return { status: 200, message: "Resource successfully added to the sheet" };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
