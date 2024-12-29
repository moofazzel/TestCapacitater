import { google } from "googleapis";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";

export async function googleAuth(email) {
  if (!email) {
    throw new Error("Email is required for Google API authentication.");
  }

  // Connect to the database and fetch the user's tokens
  await dbConnect();
  const user = await User.findOne({ email });

  if (!user || !user.google_tokens || !user.google_tokens.access_token) {
    throw new Error("User's Google tokens are missing or invalid.");
  }

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  );

  oauth2Client.setCredentials({
    access_token: user.google_tokens.access_token,
    refresh_token: user.google_tokens.refresh_token,
    scope: user.google_tokens.scope,
    token_type: user.google_tokens.token_type,
    expiry_date: user.google_tokens.expiry_date,
  });

  // Automatically refresh tokens if expired
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) {
      user.google_tokens.refresh_token = tokens.refresh_token;
    }
    user.google_tokens.access_token = tokens.access_token;
    user.google_tokens.expiry_date = tokens.expiry_date;
    await user.save();
  });

  return oauth2Client;
}
