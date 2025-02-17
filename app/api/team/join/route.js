import dbConnect from "@/lib/mongodb";
import Team from "@/models/team-model";
import { User } from "@/models/user-model";
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

    const existingUser = await User.findOne({ email: member.email });

    let existingOwnerName = null;
    let isOwner = false;

    if (existingUser) {
      const existingOwner = await Team.findOne({
        owner: existingUser._id,
      });
      if (existingOwner) {
        existingOwnerName = existingUser.name;
        isOwner = true;
      }
    }

    return NextResponse.json(
      {
        email: member.email,
        isOwner,
        existingOwnerName,
        message: "Token verified successfully.",
      },
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
