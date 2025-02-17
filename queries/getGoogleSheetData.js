import { googleAuth } from "@/utils/googleAuth";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { getSpreadsheetData } from "./getSpreadsheetData";

// Expected headers in order (static part)
const EXPECTED_HEADERS = [
  "Deal ID",
  "Client",
  "Project",
  "Deal Stage",
  "Start Date",
  "End Date",
  "Deal Owner",
];

// Function to map user headers dynamically
function mapHeaders(sheetHeaders) {
  let headerMap = {};
  let customColumnIndex = null; // Store Column H index
  let dealOwnerColumnName = "Deal Owner"; // Default name
  let dealOwnerColumnIndex = sheetHeaders.indexOf("Deal Owner"); // Find "Deal Owner" index

  // If "Deal Owner" isn't found, assume G column as "Deal Owner"
  if (dealOwnerColumnIndex === -1 && sheetHeaders.length >= 7) {
    dealOwnerColumnIndex = 6; // G is at index 6
    dealOwnerColumnName = sheetHeaders[6]; // Get the actual column name in G
  }

  // Map known headers (Deal ID, Client, etc.)
  EXPECTED_HEADERS.forEach((expectedHeader, index) => {
    headerMap[expectedHeader] = index < sheetHeaders.length ? index : -1;
  });

  // Identify Column H dynamically (Custom field)
  if (sheetHeaders.length >= 8) {
    customColumnIndex = 7; // H is at index 7 (0-based index)
  }

  return {
    headerMap,
    customColumnIndex,
    dealOwnerColumnIndex,
    dealOwnerColumnName,
  };
}

export async function getGoogleSheetData() {
  try {
    // Fetch spreadsheet info from the DB
    const { email, spreadsheetId, sheetNames } = await getSpreadsheetData();

    // Authenticate with Google Sheets API
    const client = await googleAuth(email);
    const gsapi = google.sheets({ version: "v4", auth: client });

    let deals = [];
    let resources = [];

    for (const sheetName of sheetNames) {
      const opt = {
        spreadsheetId,
        range: `${sheetName}`, // Fetch all data in each sheet
      };

      try {
        // Fetch data from the Google Sheet
        const response = await gsapi.spreadsheets.values.get(opt);
        const rows = response.data.values;

        if (!rows || !rows.length) {
          continue;
        }

        // Extract headers dynamically (first row is header)
        const sheetHeaders = rows[0];
        const {
          headerMap,
          customColumnIndex,
          dealOwnerColumnIndex,
          dealOwnerColumnName,
        } = mapHeaders(sheetHeaders);
        const customFieldName =
          customColumnIndex !== null ? sheetHeaders[customColumnIndex] : null; // Name of Column H

        // Process rows into structured format
        const data = rows.slice(1).map((row) => {
          let rowData = { id: uuidv4() };

          // Process deals sheet
          if (sheetName.toLowerCase() === sheetNames[0].toLowerCase()) {
            // Process standard columns
            EXPECTED_HEADERS.forEach((header) => {
              const index = headerMap[header];
              rowData[header] = index !== -1 ? row[index] || "" : "";
            });

            // Process the "Deal Owner" column dynamically
            if (dealOwnerColumnIndex !== -1) {
              rowData["Deal Owner"] = row[dealOwnerColumnIndex] || "";
              rowData["dealOwnerColumnName"] = dealOwnerColumnName;
            }

            // Process the dynamic "H" column
            if (customColumnIndex !== null) {
              const customFieldValue = row[customColumnIndex] || ""; // Fetch value for Column H (Location, Position, etc.)
              rowData[customFieldName] = customFieldValue;
            }
          } else {
            // Process resources sheet normally
            sheetHeaders.forEach((header, colIndex) => {
              rowData[header] = row[colIndex] || "";
            });
          }
          return rowData;
        });

        // Assign data to deals or resources depending on sheet
        if (sheetName.toLowerCase() === sheetNames[0].toLowerCase()) {
          deals = data;
        } else if (sheetName.toLowerCase() === sheetNames[1].toLowerCase()) {
          resources = data;
        }
      } catch (sheetError) {
        console.error(`Error in sheet: ${sheetName}`, sheetError);
        return handleSheetError(sheetError, sheetName);
      }
    }
    return { status: 200, data: { deals, resources } };
  } catch (e) {
    return handleGeneralError(e);
  }
}

// Function to handle specific sheet errors
function handleSheetError(sheetError, sheetName) {
  if (sheetError.code === 403) {
    return {
      status: 403,
      error: true,
      message: "You do not have permission to access this sheet.",
    };
  } else if (sheetError.code === 404) {
    return {
      status: 404,
      error: true,
      message: `Sheet "${data}" not found.`,
    };
  } else if (
    sheetError.code === "ENOTFOUND" ||
    sheetError.code === "ETIMEDOUT"
  ) {
    return {
      status: 503,
      error: true,
      message:
        "Google Sheets API is currently unreachable. Please check your connection or try again later.",
    };
  } else {
    return {
      status: 400,
      error: true,
      message: `Error fetching data from sheet "${sheetName}": ${sheetError.message}`,
    };
  }
}

// Function to handle general errors
function handleGeneralError(e) {
  if (e.code === "ENOTFOUND" || e.code === "ETIMEDOUT") {
    return {
      status: 503,
      error: true,
      message:
        "Google Sheets API is currently unreachable. Please check your connection or try again later.",
    };
  }
  console.error("Error fetching Google Sheets data:", e.message);
  return {
    status: 500,
    error: true,
    message:
      "An internal error occurred while accessing Google Sheets. Please try again later.",
  };
}
