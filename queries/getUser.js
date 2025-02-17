import dbConnect from "@/lib/mongodb";
import { StripeSubscription as Subscription } from "@/models/stripeSubscriptions-model";
import { User as UserModel } from "@/models/user-model";
import Team from "@/models/team-model";

export async function getUserData(
  email,
  options = { includeSensitiveData: false, includeSubscriptionStatus: false }
) {
  try {
    await dbConnect();

    // Fetch the user by email.
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return null;
    }

    // Exclude password if not requested.
    if (!options.includeSensitiveData) {
      delete user.password;
    }

    // If user is a team member, skip subscription data.
    if (user.isTeamMember) {
      const team = await Team.findOne({ "members.email": email }).lean();
      if (!team) {
        return null;
      }
      const owner = await UserModel.findById(team.owner).lean();
      if (!owner) {
        return null;
      }

      // Exclude owner's password if not requested.
      if (!options.includeSensitiveData) {
        delete owner.password;
      }

      // Return the team-member view with NO subscription data.
      return {
        isTeamMember: true,
        userId: owner._id,
        ownerName: owner.name,
        memberName: user.name, // current user is the team member
        email: owner.email,
        dealsTabName: owner.deals_tab_name,
        resourcesTabName: owner.resources_tab_name,
        googleSheetId: owner.google_sheet_id,
        twoFactorAuth: owner.two_factor_auth,
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

        // Do NOT include subscription data for team members.
        subscriptionData: null,

        // Include googleTokens if requested.
        googleTokens: options.includeSensitiveData
          ? owner.google_tokens
          : undefined,
      };
    }

    // 4) If user is not a team member, optionally fetch subscription.
    let subscription = null;
    if (options.includeSubscriptionStatus) {
      subscription = await Subscription.findOne({ userId: user._id }).lean();
    }

    // Return the data.
    return {
      isTeamMember: false,
      userId: user._id,
      ownerName: user.name,
      memberName: null,
      email: user.email,
      dealsTabName: user.deals_tab_name,
      resourcesTabName: user.resources_tab_name,
      googleSheetId: user.google_sheet_id,
      twoFactorAuth: user.two_factor_auth,
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

      // Subscription data only for non-team members if requested.
      subscriptionData: subscription
        ? {
            planName: subscription.planName,
            planId: subscription.planId,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            latestInvoiceUrl: subscription.latestInvoiceUrl,
          }
        : null,

      // Include googleTokens if requested.
      googleTokens: options.includeSensitiveData
        ? user.google_tokens
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
}
