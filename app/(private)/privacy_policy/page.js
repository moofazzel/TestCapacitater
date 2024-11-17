import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import PrivacyPolicy from "./_components/PrivacyPolicy";

const page = async () => {
  const session = await auth();

  // Fetch user data asynchronously and wait for the result
  const user = await getUserData(session?.user?.email);
  return (
    <>
      <PrivacyPolicy user={user} />
    </>
  );
};

export default page;
