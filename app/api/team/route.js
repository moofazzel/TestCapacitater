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

    //  return NextResponse.json(team.members, { status: 200 });

    // Check if the user is a team owner
    const teamAsOwner = await Team.findOne({ owner: user.id }, "members owner");

    if (teamAsOwner) {
      // User is the owner, return the team members
      return NextResponse.json(teamAsOwner.members, {
        status: 200,
      });
    }

    // Check if the user is a team member
    const teamAsMember = await Team.findOne({ "members.email": user.email });

    if (teamAsMember) {
      // User is a team member, return the team members along with owner info
      return NextResponse.json(teamAsMember.members, {
        status: 200,
      });
    }

    // If the user is neither an owner nor a member
    return NextResponse.json(
      [],
      { message: "User is not part of any team." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      [],
      { message: "An error occurred while fetching team data." },
      { status: 500 }
    );
  }
};
