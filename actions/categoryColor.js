"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import CategoryColor from "@/models/categoryColor-model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function addOrUpdateCategoryColor(
  categoryName,
  color,
  categoryId = null
) {
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

    // Check if the user has a CategoryColor document
    let userCategoryColors = await CategoryColor.findOne({ userId: user.id });

    if (!userCategoryColors) {
      // If no document exists, create a new one with the initial category
      userCategoryColors = new CategoryColor({
        userId: user.id,
        categories: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: categoryName,
            bgColor: color,
          },
        ],
      });
    } else {
      let category = null;

      // If categoryId is provided, find the category by ID
      if (categoryId) {
        category = userCategoryColors.categories.find(
          (cat) => cat._id.toString() === categoryId.toString()
        );
      } else {
        // If categoryId is not provided, find by name (case-insensitive)
        category = userCategoryColors.categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
      }

      if (category) {
        // Update the existing category color
        category.bgColor = color;
      } else {
        // Add the new category if it doesn’t exist
        userCategoryColors.categories.push({
          _id: new mongoose.Types.ObjectId(),
          name: categoryName,
          bgColor: color,
        });
      }
    }

    await userCategoryColors.save();

    // Revalidate the page to reflect the updated colors
    revalidatePath("/app");

    return {
      success: true,
      status: 200,
      message: categoryId
        ? "Category color updated successfully"
        : "Category color added successfully",
    };
  } catch (error) {
    console.error("Error updating category color:", error);
    throw new Error("Failed to update category color");
  }
}

export async function deleteCategoryColor(categoryId) {
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

    // Find the user's category colors document
    let userCategoryColors = await CategoryColor.findOne({ userId: user.id });
    if (!userCategoryColors) {
      return {
        success: false,
        status: 404,
        message: "Category colors not found for user",
      };
    }

    // Filter out the category by ID
    userCategoryColors.categories = userCategoryColors.categories.filter(
      (cat) => cat._id.toString() !== categoryId.toString()
    );

    await userCategoryColors.save();

    // Revalidate the page to reflect the deleted category
    revalidatePath("/app");

    return {
      success: true,
      status: 200,
      message: "Category color deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting category color:", error);
    throw new Error("Failed to delete category color");
  }
}
