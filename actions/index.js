"use server";

import dbConnect from "@/lib/mongodb";

import { signIn } from "@/auth";
import Team from "@/models/team-model";
import { User } from "@/models/user-model";
import { getUserData } from "@/queries/getUser";
import bcrypt from "bcryptjs";

export async function credentialLogin(formData) {
  // Connect to the MongoDB database if not already connected
  await dbConnect();
  try {
    const user = await User.findOne({ email: formData.get("email") });
    if (!user) {
      throw new Error("User not found");
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
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
}

export async function teamMemberRegAndLogin(formData) {
  await dbConnect();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  try {
    // Find the token by email
    const team = await Team.findOne({
      "members.email": email,
      "members.tokenExpiration": { $gte: new Date() }, // Token is not expired
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
    if (!user) {
      user = await User.create({
        email,
        name,
        password: hashedPassword,
        isTeamMember: true,
      });
    }

    // Mark the member as joined in the team
    member.joined = true;
    member.token = null; // Clear the token
    member.tokenExpiration = null; // Clear expiration
    await team.save();

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
