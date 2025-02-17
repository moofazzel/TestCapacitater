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

// update comment
export async function updateComment(dealId, commentId, comment) {
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

    const updatedComment = await Comment.findOneAndUpdate(
      {
        dealId: dealId,
        _id: commentId,
      },
      { $set: { comment: comment, isEdited: true } },
      { new: true }
    );

    if (!updatedComment) {
      return {
        success: false,
        status: 404,
        message: "Comment not found",
      };
    }

    // Revalidate the /app page
    revalidatePath("/app");

    return {
      success: true,
      status: 200,
      message: "Comment updated",
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
}

// delete comment
export async function deleteComment(dealId, commentId) {
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

    const deletedComment = await Comment.findOneAndDelete({
      dealId: dealId,
      _id: commentId,
    });

    if (!deletedComment) {
      return {
        success: false,
        status: 404,
        message: "Comment not found",
      };
    }

    // Revalidate the /app page
    revalidatePath("/app");

    return {
      success: true,
      status: 200,
      message: "Comment deleted",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}
