"use server";

import { auth } from "@/auth";
import { DealLog } from "@/models/DealLogSchema";
import { getSpreadsheetData } from "@/queries/getSpreadsheetData";
import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";

export async function writeNewDealForResources(
  dealResourceDataArray,
  deselectedResources
) {
  try {
    // Fetch spreadsheet info from User in DB
    const { spreadsheetId, sheetNames, email } = await getSpreadsheetData();

    const session = await auth();

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    // Specify the "resources" sheet name
    const sheetName = sheetNames[1]; // Ensure this matches the "resources" sheet name in your Google Sheets

    // Fetch the sheet data
    const opt = {
      spreadsheetId,
      range: `${sheetName}`,
    };

    const response = await gsapi.spreadsheets.values.get(opt);
    const rows = response.data.values;

    // === Determine the starting column for deals dynamically ===
    // Look for a header cell that includes "deal id" (case-insensitive)
    let dealStartColumnIndex = rows[0].findIndex(
      (cell) => cell && cell.toLowerCase().includes("deal id")
    );
    // If not found, default to column index 4.
    if (dealStartColumnIndex === -1) {
      dealStartColumnIndex = 4;
    }

    // === Handle deselected resources (deletion) ===
    for (const { dealId, resourceName } of deselectedResources) {
      const resourceRowIndex = rows.findIndex((row) => row[0] === resourceName);
      if (resourceRowIndex === -1) {
        continue;
      }

      const dealType = "remove";

      // Loop through the resource row starting at the dealStartColumnIndex
      for (
        let i = dealStartColumnIndex;
        i < rows[resourceRowIndex].length;
        i += 2
      ) {
        if (rows[resourceRowIndex][i] === dealId) {
          // Remove the deal ID and its corresponding capacity
          rows[resourceRowIndex].splice(i, 2);
          // Optionally, maintain the row length by appending empty cells
          rows[resourceRowIndex].push("", "");
          break;
        }
      }

      // Update the resource row after removal
      const updateOptions = {
        spreadsheetId,
        range: `${sheetName}!A${resourceRowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [rows[resourceRowIndex]] },
      };
      await gsapi.spreadsheets.values.update(updateOptions);

      // Log the deletion
      await DealLog.create({
        dealId,
        userName: session?.user?.name,
        resourceName,
        actionType: dealType,
      });
    }

    // === Handle selected resources (addition or update) ===
    for (const {
      dealId,
      resourceName,
      resourceCapacity,
    } of dealResourceDataArray) {
      const resourceRowIndex = rows.findIndex((row) => row[0] === resourceName);
      if (resourceRowIndex === -1) {
        continue;
      }

      let dealType = "add"; // Default action is "add"
      let dealUpdated = false;

      // Check if this deal already exists in the resource row
      for (
        let i = dealStartColumnIndex;
        i < rows[resourceRowIndex].length;
        i += 2
      ) {
        if (rows[resourceRowIndex][i] === dealId) {
          if (rows[resourceRowIndex][i + 1] !== resourceCapacity) {
            dealType = "update"; // Capacity is being updated
            rows[resourceRowIndex][i + 1] = resourceCapacity;
          } else {
            dealType = "unchanged"; // No change
          }
          dealUpdated = true;

          // Update the resource row in the sheet
          const updateOptions = {
            spreadsheetId,
            range: `${sheetName}!A${resourceRowIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [rows[resourceRowIndex]] },
          };
          await gsapi.spreadsheets.values.update(updateOptions);
          break;
        }
      }

      if (!dealUpdated) {
        // The deal doesn't exist yet; determine where to add it.
        let lastDealIndex = dealStartColumnIndex;
        let dealNumber = 1;

        // Find the next available slot by checking the header row.
        while (rows[0][lastDealIndex]) {
          // If the resource row is missing a value here, use this slot.
          if (!rows[resourceRowIndex][lastDealIndex]) {
            break;
          }
          lastDealIndex += 2;
          dealNumber++;
        }

        // If the header row doesn’t yet have a label for this deal slot, add one.
        if (!rows[0][lastDealIndex]) {
          rows[0][lastDealIndex] = `Deal ID ${dealNumber}`;
          rows[0][lastDealIndex + 1] = `Deal Capacity ${dealNumber}(%)`;

          // Update the header row with the new deal columns.
          const headerUpdateOptions = {
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [rows[0]] },
          };
          await gsapi.spreadsheets.values.update(headerUpdateOptions);
        }

        // Add the new deal to the resource row.
        rows[resourceRowIndex][lastDealIndex] = dealId;
        rows[resourceRowIndex][lastDealIndex + 1] = resourceCapacity;

        const updateOptions = {
          spreadsheetId,
          range: `${sheetName}!A${resourceRowIndex + 1}`,
          valueInputOption: "USER_ENTERED",
          resource: { values: [rows[resourceRowIndex]] },
        };
        await gsapi.spreadsheets.values.update(updateOptions);
      }

      // Log the action unless there was no change.
      if (dealType !== "unchanged") {
        await DealLog.create({
          dealId,
          userName: session?.user?.name,
          resourceName,
          actionType: dealType,
        });
      }
    }

    return { status: 200, message: "Deals successfully updated in the sheet" };
  } catch (e) {
    console.error(e);
    return { status: 400, error: true, message: e.message };
  }
}
