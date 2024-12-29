import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";

export const checkSubscriptionStatus = async () => {
  const session = await auth();
  const user = await getUserData(session?.user?.email);

  // Get the current date
  const currentDate = new Date();

  let status = true;
  let message = "";

  // Check if the trial is active
  if (user?.isTrialActive && user?.trialEndDate) {
    const trialEndDate = new Date(user.trialEndDate);

    // If the current date is after the trial end date, the trial has ended
    if (currentDate > trialEndDate) {
      status = false;
      message = "Your Trial has ended";
    } else {
      status = true;
      message =
        "Your Trial still active please upgrade your subscription to continue using CapaciTater";
    }
  }

  return { status, message };
};
