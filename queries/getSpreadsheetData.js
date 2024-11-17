import { auth } from "@/auth";
import { getUserData } from "./getUser";

export async function getSpreadsheetData() {
  // Authenticate the user
  const { user } = await auth();

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  // Use the getUserData function to fetch the user details
  const foundUser = await getUserData(user?.email);

  // Return the spreadsheetId and sheetNames from the user data
  return {
    spreadsheetId: foundUser.googleSheetId,
    sheetNames: [foundUser.dealsTabName, foundUser.resourcesTabName],
  };
}
