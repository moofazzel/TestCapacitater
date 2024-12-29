import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";

export async function checkLegacyUser(email) {
  try {
    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user is a team member then return true
    if (user) {
      return {
        isLegacy: false,
      };
    }

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is Legacy
    const legacyThresholdDate = new Date("2024-12-17");

    const isLegacy =
      new Date(user.createdAt) < legacyThresholdDate &&
      (!user.initial_setup_complete || !user.google_sheets_permission);

    return {
      isLegacy,
    };
  } catch (error) {
    console.error("Error checking legacy user:", error.message);
    throw new Error("Failed to check legacy user");
  }
}
