import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Team from "@/models/team-model";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  await dbConnect();

  try {
    const { user } = await auth();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { memberEmail } = await req.json();

    // Use Mongoose's `$pull` operator to remove the member
    const result = await Team.findOneAndUpdate(
      { owner: user.id, "members.email": memberEmail }, // Match team and member
      { $pull: { members: { email: memberEmail } } }, // Remove the member
      { new: true } // Return the updated document
    );

    if (!result) {
      return NextResponse.json(
        { error: "Team or member not found." },
        { status: 404 }
      );
    }

    revalidatePath("/profile"); // Revalidate the profile page

    return Response.json(
      result.members,
      { message: `Team member ${memberEmail} has been removed successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "An error occurred while removing the team member." },
      { status: 500 }
    );
  }
};
