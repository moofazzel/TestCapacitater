"use server";

import dbConnect from "@/lib/mongodb";

import { signIn } from "@/auth";
import CategoryColor from "@/models/categoryColor-model";
import Team from "@/models/team-model";
import { User } from "@/models/user-model";
import { getUserData } from "@/queries/getUser";
import { sendEmail } from "@/utils/sendEmailWithSendGrid";
import bcrypt from "bcryptjs";

export async function credentialLogin(formData) {
  // Connect to the MongoDB database if not already connected
  await dbConnect();
  try {
    const user = await User.findOne({ email: formData.get("email") });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!user.password) {
      return {
        success: false,
        message:
          "It seems you signed up with Google. Please try google log in.",
      };
    }

    const isValidPassword = await bcrypt.compare(
      formData.get("password"),
      user.password
    );

    if (!isValidPassword) {
      return { success: false, message: "Invalid password" };
    }

    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // Disable auto redirection
    });

    if (response && !response.error) {
      const user = await getUserData(formData.get("email"));

      if (user?.initialSetupComplete && user?.googleSheetPermission) {
        return { success: true, redirectPath: "/app" };
      } else {
        return { success: true, redirectPath: "/setup" };
      }
    } else {
      throw new Error(response.error || "Login failed");
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

// register a team member and create a user if not exists
export async function teamMemberRegAndLogin(formData) {
  await dbConnect();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  try {
    // Find the member by email
    const team = await Team.findOne({
      "members.email": email,
    });

    if (!team) {
      throw new Error("No valid invitation found for this email.");
    }

    // Find the member associated with the email
    const member = team.members.find((m) => m.email === email && m.token);

    if (!member) {
      throw new Error("Invalid or expired token for this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.isTeamMember = true;
      await user.save();
    }

    if (!user) {
      user = await User.create({
        email,
        name,
        password: hashedPassword,
        isTeamMember: true,
      });
    }

    // Mark the member as joined in the team
    // member.joined = true;
    // member.token = null; // Clear the token
    // member.tokenExpiration = null; // Clear expiration
    // member.name = name; // Update the name
    await team.save();

    // Find team owner
    const teamOwner = await User.findById(team.owner);

    try {
      await sendEmail({
        to: "savvysoftware23@gmail.com",
        subject: "Team Member Joined",
        html: `
          <h1>Team Member Joined</h1>
          <p>${name} has joined (${teamOwner.name}) in capacitater.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return {
        success: false,
        status: 500,
        message: "Failed to send the notification email.",
      };
    }

    // Replace team member's category colors with the owner's ---
    if (user._id.toString() !== team.owner.toString()) {
      // Retrieve the team owner's category colors
      const ownerCategoryColors = await CategoryColor.findOne({
        userId: team.owner,
      });
      if (ownerCategoryColors) {
        // Update or create the team member's category colors with the owner's categories
        await CategoryColor.findOneAndUpdate(
          { userId: user._id },
          { categories: ownerCategoryColors.categories },
          { upsert: true, new: true }
        );
      }
    }

    // Log in the user
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response && !response.error) {
      return {
        success: true,
        redirectPath: "/app", // Redirect to team app
      };
    } else {
      throw new Error(response.error || "Login failed.");
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during registration/login.",
    };
  }
}

export async function teamMemberGoogleLogin({ email }) {
  await dbConnect();

  signIn("google", {
    // callbackUrl: "/dashboard", // Redirect after login
    login_hint: email,
  });
}
