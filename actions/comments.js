"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Comment } from "@/models/comments-model";
import { revalidatePath } from "next/cache";

export async function addCommentToDeal(dealId, comment) {
  try {
    await dbConnect();

    const { user } = await auth();

    if (!user || !user.email) {
      return {
        success: false,
        status: 401,
        message: "User not authenticated",
      };
    }

    const newComment = new Comment({
      dealId: dealId,
      userId: user.id,
      comment: comment,
    });
    await newComment.save();

    // Revalidate the /app page
    revalidatePath("/app");

    return {
      success: true,
      status: 200,
      message: "Comment added",
    };
  } catch (error) {
    console.error("Error commenting:", error);
    throw new Error("Failed to comment");
  }
}
