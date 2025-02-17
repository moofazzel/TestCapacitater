import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import ProfilePageTabs from "./_components/ProfilePageTabs";

const ProfilePage = async () => {
  // Get the session
  const session = await auth();

  const options = {
    includeSubscriptionStatus: true,
  };

  // Fetch user data asynchronously and wait for the result
  const user = await getUserData(session?.user?.email, options);

  return <ProfilePageTabs user={user} />;
};

export default ProfilePage;
