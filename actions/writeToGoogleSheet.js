"use server";

import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function writeNewDealForResources(
  dealResourceDataArray,
  deselectedResources
) {
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

    // Handle deselected resources
    for (const { dealId, resourceName } of deselectedResources) {
      const resourceRowIndex = rows.findIndex((row) => row[0] === resourceName);
      if (resourceRowIndex === -1) {
        continue;
      }

      // Find the deal ID in the resource row and remove it along with its capacity
      for (let i = 4; i < rows[resourceRowIndex].length; i += 2) {
        if (rows[resourceRowIndex][i] === dealId) {
          rows[resourceRowIndex].splice(i, 2); // Remove both Deal ID and Deal Capacity
          rows[resourceRowIndex].push("", ""); // Append empty cells at the end
          break;
        }
      }

      // Update the resource row after removing the deal ID and capacity
      const updateOptions = {
        spreadsheetId,
        range: `${sheetName}!A${resourceRowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [rows[resourceRowIndex]],
        },
      };
      await gsapi.spreadsheets.values.update(updateOptions);
    }

    // Handle selected resources (resourcesToAdd)
    for (const {
      dealId,
      resourceName,
      resourceCapacity,
    } of dealResourceDataArray) {
      const resourceRowIndex = rows.findIndex((row) => row[0] === resourceName);
      if (resourceRowIndex === -1) {
        continue;
      }

      let dealUpdated = false;

      // Check if the deal ID already exists in the resource row and update its capacity
      for (let i = 4; i < rows[resourceRowIndex].length; i += 2) {
        if (rows[resourceRowIndex][i] === dealId) {
          rows[resourceRowIndex][i + 1] = resourceCapacity; // Update the deal capacity
          dealUpdated = true;

          // Write back the updated resource row to the sheet
          const updateOptions = {
            spreadsheetId,
            range: `${sheetName}!A${resourceRowIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: {
              values: [rows[resourceRowIndex]],
            },
          };
          await gsapi.spreadsheets.values.update(updateOptions);
          break;
        }
      }

      if (!dealUpdated) {
        // If there is no empty slot, add a new header and value
        let lastDealIndex = 4; // Start checking from Deal ID 1 (index 4)
        let dealNumber = 1;

        while (rows[0][lastDealIndex]) {
          if (!rows[resourceRowIndex][lastDealIndex]) {
            break; // Found an empty deal slot
          }
          lastDealIndex += 2; // Move to the next Deal ID and Deal Capacity pair
          dealNumber++;
        }

        if (!rows[0][lastDealIndex]) {
          rows[0][lastDealIndex] = `Deal ID ${dealNumber}`;
          rows[0][lastDealIndex + 1] = `Deal Capacity ${dealNumber}(%)`;

          // Update the header row with the new headers
          const headerUpdateOptions = {
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "USER_ENTERED",
            resource: {
              values: [rows[0]], // The updated header row
            },
          };
          await gsapi.spreadsheets.values.update(headerUpdateOptions);
        }

        // Add the new deal ID and capacity in the empty slots
        rows[resourceRowIndex][lastDealIndex] = dealId;
        rows[resourceRowIndex][lastDealIndex + 1] = resourceCapacity;

        // Write back the updated resource row to the sheet
        const updateOptions = {
          spreadsheetId,
          range: `${sheetName}!A${resourceRowIndex + 1}`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [rows[resourceRowIndex]],
          },
        };

        await gsapi.spreadsheets.values.update(updateOptions);
      }
    }

    return { status: 200, message: "Deals successfully updated in the sheet" };
  } catch (e) {
    return { status: 400, error: true, message: e.message };
  }
}
