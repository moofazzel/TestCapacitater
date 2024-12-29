import dbConnect from "@/lib/mongodb";
import Team from "@/models/team-model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const { token } = await req.json();

  // Ensure database connection
  await dbConnect();

  try {
    // Find the team with a valid token
    const team = await Team.findOne({
      "members.token": token,
      "members.tokenExpiration": { $gte: new Date() }, // Token is not expired
    });

    if (!team) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    // Find the team member with the provided token
    const member = team.members.find((m) => m.token === token);

    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    return NextResponse.json(
      member?.email,
      { message: "You have successfully joined the team." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the token." },
      { status: 500 }
    );
  }
};
