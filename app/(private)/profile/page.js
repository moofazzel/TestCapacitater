import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import UserProfile from "./_components/UserProfile";

const ProfilePage = async () => {
  // Fetch environment variables (server-side)
  const templateLink = process.env.TEMPLATE_LINK;
  const googleAuthClientEmail = process.env.GOOGLE_AUTH_CLIENT_EMAIL;
  // Get the session
  const session = await auth();

  // Fetch user data asynchronously and wait for the result
  const user = await getUserData(session?.user?.email);

  return (
    <>
      <UserProfile
        user={user}
        templateLink={templateLink}
        googleAuthClientEmail={googleAuthClientEmail}
      />
    </>
  );
};

export default ProfilePage;
