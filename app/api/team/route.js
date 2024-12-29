import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/team-model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  await dbConnect();

  try {
    const { user } = await auth();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    // Fetch the team members for the authenticated user
    const team = await Team.findOne({ owner: user.id }, "members");

    if (!team || team.members.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    // Return only the team members
    return NextResponse.json(team.members, { status: 200 });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching team members." },
      { status: 500 }
    );
  }
};
