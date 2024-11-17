import dbConnect from "@/lib/mongodb";
import { User } from "@/models/user-model";

export async function getUserData(email) {
  try {
    // Connect to the MongoDB database if not already connected
    await dbConnect();

    // Find the user by email and convert it to a plain JavaScript object
    const user = await User.findOne({ email }).lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Return the user data (you can exclude sensitive fields like password if needed)
    return {
      userId: user._id,
      email: user.email,
      dealsTabName: user.deals_tab_name,
      resourcesTabName: user.resources_tab_name,
      googleSheetId: user.google_sheet_id,
      twoFactorAuth: user.two_factor_auth,
      subscriptionStatus: user.subscription_status,
      userAgreement: user.user_agreement,
      privacyPolicy: user.privacy_policy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      initialSetupComplete: user.initial_setup_complete,
      stripeCustomerId: user.stripeCustomerId,
      isTrialActive: user.isTrialActive,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
}
