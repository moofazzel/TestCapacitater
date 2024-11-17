"use server";

import dbConnect from "@/lib/mongodb";

import { signIn } from "@/auth";
import { User } from "@/models/user-model";
import { getUserData } from "@/queries/getUser";

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

      if (user.initialSetupComplete) {
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
