import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";
import { google } from "googleapis";

export async function copyGoogleSheet(email, templateSpreadsheetId) {
  try {
    // Connect to the database and fetch user tokens
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user || !user.google_tokens || !user.google_tokens.access_token) {
      throw new Error("User not authenticated with Google");
    }

    // Initialize Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(user.google_tokens);

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Get all sheets from the template spreadsheet
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: templateSpreadsheetId,
    });

    const sheetsInTemplate = sheetInfo.data.sheets;

    if (!sheetsInTemplate || sheetsInTemplate.length === 0) {
      throw new Error("No sheets found in the template spreadsheet");
    }

    // Create a new spreadsheet
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: "Capacitater Template Sheet",
        },
      },
    });

    const newSpreadsheetId = createResponse.data.spreadsheetId;

    let firstCopiedSheetId;

    // Copy each sheet from the template to the new spreadsheet
    for (const [index, sheet] of sheetsInTemplate.entries()) {
      const copyResponse = await sheets.spreadsheets.sheets.copyTo({
        spreadsheetId: templateSpreadsheetId, // Template spreadsheet ID
        sheetId: sheet.properties.sheetId, // ID of the sheet to copy
        requestBody: {
          destinationSpreadsheetId: newSpreadsheetId, // New spreadsheet ID
        },
      });

      // Store the first copied sheet's ID to ensure at least one sheet remains
      if (index === 0) {
        firstCopiedSheetId = copyResponse.data.sheetId;
      }

      // Rename the copied sheet to match the original name
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: newSpreadsheetId,
        requestBody: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: copyResponse.data.sheetId,
                  title: sheet.properties.title, // Use the original title
                },
                fields: "title",
              },
            },
          ],
        },
      });
    }

    // Delete the default "Sheet1" if we have at least one copied sheet
    if (firstCopiedSheetId) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: newSpreadsheetId,
        requestBody: {
          requests: [
            {
              deleteSheet: {
                sheetId: 0, // "Sheet1" is typically assigned the ID 0
              },
            },
          ],
        },
      });
    }

    // Save the new spreadsheet ID to the user's record
    user.google_sheet_id = newSpreadsheetId;
    user.initial_setup_complete = true;
    await user.save();

    return { success: true, spreadsheetId: newSpreadsheetId };
  } catch (error) {
    console.error("Error copying Google Sheet:", error);
    return { success: false, error: error.message };
  }
}
