import dbConnect from "@/lib/mongodb";
import Team from "@/models/team-model";
import { User } from "@/models/user-model";

export async function getUserData(
  email,
  options = { includeSensitiveData: false }
) {
  try {
    // Connect to the MongoDB database
    await dbConnect();

    // Query for the user by email
    const query = User.findOne({ email });

    // Exclude sensitive fields unless explicitly requested
    if (!options.includeSensitiveData) {
      query.select("-password"); // Exclude password by default
    }

    // Fetch the user and convert it to a plain JavaScript object
    const user = await query.lean();

    // Handle case where user is not found
    if (!user) {
      return null;
    }

    // Handle team member case
    if (user?.isTeamMember) {
      const team = await Team.findOne({
        "members.email": email,
      }).lean();

      if (!team) {
        return null;
      }

      const owner = await User.findById(team.owner).lean();

      if (!owner) {
        return null;
      }

      return {
        isTeamMember: true,
        userId: owner._id,
        email: owner.email,
        dealsTabName: owner.deals_tab_name,
        resourcesTabName: owner.resources_tab_name,
        googleSheetId: owner.google_sheet_id,
        twoFactorAuth: owner.two_factor_auth,
        subscriptionStatus: owner.subscription_status,
        userAgreement: owner.user_agreement,
        privacyPolicy: owner.privacy_policy,
        createdAt: owner.createdAt,
        updatedAt: owner.updatedAt,
        initialSetupComplete: owner.initial_setup_complete,
        googleSheetPermission: owner.google_sheets_permission,
        stripeCustomerId: owner.stripeCustomerId,
        isTrialActive: owner.isTrialActive,
        trialStartDate: owner.trialStartDate,
        trialEndDate: owner.trialEndDate,

        // Include googleTokens if requested
        googleTokens: options.includeSensitiveData
          ? owner.google_tokens
          : undefined,
      };
    }

    // Return the user data, including googleTokens if requested
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
      googleSheetPermission: user.google_sheets_permission,
      stripeCustomerId: user.stripeCustomerId,
      isTrialActive: user.isTrialActive,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,

      // Include googleTokens if requested
      googleTokens: options.includeSensitiveData
        ? user.google_tokens
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
}
