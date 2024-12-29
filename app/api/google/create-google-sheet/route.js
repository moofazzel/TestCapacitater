import { copyGoogleSheet } from "@/utils/createGoogleSheet";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    const templateSpreadsheetId = process.env.CAPACITATER_TEMPLATE_SHEET_ID;

    if (!email || !templateSpreadsheetId) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and templateSpreadsheetId are required",
        },
        { status: 400 }
      );
    }

    const result = await copyGoogleSheet(email, templateSpreadsheetId);

    if (result.success) {
      return NextResponse.json(
        { success: true, spreadsheetId: result.spreadsheetId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error.message);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
