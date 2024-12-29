import { google } from "googleapis";

export async function GET(request) {
  const url = new URL(request.url);
  const migrate =
    url.searchParams.get("migrate") === "true" ? "migrate=true" : "";

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/google/callback`
  );

  const state = migrate;

  const urlWithState = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
    state,
  });

  return new Response(JSON.stringify({ url: urlWithState }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
