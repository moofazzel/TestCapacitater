"use server";

import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";
import { revalidatePath } from "next/cache";

export async function updateUser(email, updateFields) {
  try {
    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Convert Mongoose document to plain object
    const plainUser = updatedUser.toObject();

    // Build a response object dynamically based on the fields that were updated
    const response = {};

    Object.keys(updateFields).forEach((key) => {
      if (plainUser[key] !== undefined) {
        response[key] = plainUser[key];
      }
    });

    // Revalidate the /profile page
    revalidatePath("/profile");

    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}
