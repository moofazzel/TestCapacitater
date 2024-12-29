import { auth } from "@/auth"; // For session management
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";
import { google } from "googleapis";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // Retrieve the state parameter

  if (!code) {
    console.error("Authorization code is missing.");
    return new Response(
      JSON.stringify({ error: "Authorization code is missing" }),
      { status: 400 }
    );
  }

  console.log("Authorization Code:", code);
  console.log("State Parameter:", state);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  );

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Retrieve the user's session
    const session = await auth();

    if (!session?.user?.email) {
      console.error("User email is missing from session.");
      return new Response(
        JSON.stringify({ error: "User email is missing from session" }),
        { status: 401 }
      );
    }

    const email = session.user.email;

    // Save tokens to the database
    await dbConnect();
    await User.findOneAndUpdate(
      { email },
      {
        google_tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expiry_date: tokens.expiry_date,
        },
        google_sheets_permission: true,
      },
      { upsert: true, new: true }
    );

    // Redirect to the setup page with optional migrate parameter
    const redirectUrl = `${process.env.NEXTAUTH_URL}/setup${
      state ? `?${state}` : ""
    }`;
    console.log("Redirect URL:", redirectUrl);

    return Response.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during callback processing:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process callback", details: error }),
      { status: 500 }
    );
  }
}
