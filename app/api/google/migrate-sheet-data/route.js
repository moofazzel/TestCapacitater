import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";
import { copyGoogleSheet } from "@/utils/createGoogleSheet";

export async function POST(request) {
  const { email } = await request.json();

  try {
    // Connect to the database and fetch the user
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user?.google_sheet_id) {
      throw new Error("No Google Sheet ID found for this user.");
    }

    const spreadsheetId = user.google_sheet_id;
    const publicUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

    // Perform an unauthenticated fetch request to the public sheet
    const response = await fetch(publicUrl);

    if (response.ok) {
      // New Migration Logic
      const result = await copyGoogleSheet(email, spreadsheetId);

      if (result.success) {
        return Response.json(
          {
            success: true,
            isPublic: true,
            message: "Sheet copied successfully",
          },
          { status: 200 }
        );
      } else {
        return Response.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
    } else {
      return Response.json({
        success: true,
        isPublic: false,
        message: "The Google Sheet is not publicly accessible.",
      });
    }
  } catch (error) {
    console.error("Sheet Public Access Check Error:", error.message);
    return Response.json({
      success: false,
      isPublic: false,
      message: error.message,
    });
  }
}
