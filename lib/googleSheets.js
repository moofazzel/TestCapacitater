const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// Load client secrets from a local file.
const keyFile = path.join(process.cwd(), "../GoogleSecret/secret.json");

const auth = new google.auth.GoogleAuth({
  keyFile: keyFile,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

async function getSheetData(sheetId, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  });
  return response.data.values;
}

module.exports = getSheetData;
