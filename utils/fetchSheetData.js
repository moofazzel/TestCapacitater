const { GoogleSpreadsheet } = require("@googleapis/sheets");

export const fetchSheetData = async () => {
  try {
    const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_SHEET_ID);
    await doc.useServiceAccountAuth(
      require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    );
    await doc.loadInfo(); // Important to fetch sheet metadata

    const sheet = doc.sheetsByTitle["Sheet1"]; // Replace 'Sheet1' with your sheet name
    const rows = await sheet.getRows();

    return rows.map((row) => ({
      // Map row data to your desired object structure
      id: row["id"],
      name: row["name"],
      // ... other properties
    }));
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error; // Re-throw for potential error handling in the component
  }
};
