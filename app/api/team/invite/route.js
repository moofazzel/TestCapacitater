import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { StripeSubscription } from "@/models/stripeSubscriptions-model";
import Team from "@/models/team-model";
import { User } from "@/models/user-model";
import { sendEmail } from "@/utils/sendEmailWithSendGrid";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const { email: invitedEmail, teamId } = await req.json();

  const session = await auth();
  const ownerEmail = session.user.email;

  // Ensure database connection
  await dbConnect();

  try {
    // Verify the owner's subscription
    const owner = await User.findOne({ email: ownerEmail }).populate(
      "subscriptionId"
    );
    if (!owner) {
      return NextResponse.json(
        { error: "Team owner not found." },
        { status: 404 }
      );
    }

    const subscription = await StripeSubscription.findOne({
      userId: owner._id,
    });

    // Check if the owner's plan allows adding team members
    const planName = subscription?.planName;
    if (!["Professional", "Enterprise"].includes(planName)) {
      return NextResponse.json(
        { error: "Your subscription plan does not allow adding team members." },
        { status: 403 }
      );
    }

    // Check if the invited user already exists in the app
    // const existingUser = await User.findOne({ email: invitedEmail });
    // if (existingUser) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "This email is already registered as a direct app user. Please use a different email address.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Find the team by team ID
    let team = await Team.findOne({ owner: owner._id });

    // Create a new team if it doesn't exist
    if (!team) {
      team = new Team({
        owner: owner._id,
        members: [],
        team_owner_sheet_id: owner.google_sheet_id, // Assign the owner's Google Sheet ID
        addedAt: new Date(),
      });
      await team.save();
    }

    // Check if the email is already a member of the team
    const existingMember = team.members.find(
      (member) => member.email === invitedEmail
    );
    if (existingMember) {
      return NextResponse.json(
        {
          error:
            "This email is already a member of the team. Please use a different email address.",
        },
        { status: 400 }
      );
    }

    // Generate a secure token for the invitation
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week

    // Send invitation email
    try {
      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/team/join?token=${token}&team=${owner.name}`;
      await sendEmail({
        to: invitedEmail,
        subject: "You're Invited to Join a Team",
        html: `
          <h1>You've Been Invited to Join a Team</h1>
          <p>${owner.name} has invited you to join their team.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteLink}" target="_blank">Join Team</a>
          <p>This link will expire in 7 days.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { error: "Failed to send the invitation email." },
        { status: 500 }
      );
    }

    // Add the member to the team
    team.members.push({
      email: invitedEmail,
      token,
      tokenExpiration,
    });
    await team.save();

    revalidatePath("/profile");

    return NextResponse.json(team.members, {
      message: "Member added successfully. Invitation sent.",
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the team member." },
      { status: 500 }
    );
  }
};
