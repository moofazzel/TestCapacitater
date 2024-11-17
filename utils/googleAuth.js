// googleAuth.js
import { google } from "googleapis";

export async function googleAuth() {
  const client_email = process.env.GOOGLE_AUTH_CLIENT_EMAIL;
  const private_key = process.env.GOOGLE_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n");

  if (!client_email || !private_key) {
    throw new Error("Google API credentials are missing or misconfigured.");
  }

  try {
    const client = new google.auth.JWT(client_email, null, private_key, [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);

    // Authorize the client
    await new Promise((resolve, reject) => {
      client.authorize((err, tokens) => {
        if (err) {
          reject(
            new Error("Google Sheets API authorization failed: " + err.message)
          );
        } else {
          resolve(tokens);
        }
      });
    });

    // Return the authenticated client
    return client;
  } catch (error) {
    console.error("Google API Authentication Error:", error.message);
    throw new Error("Failed to authenticate Google Sheets API.");
  }
}
