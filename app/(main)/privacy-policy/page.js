import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import PrivacyPolicy from "./_components/PrivacyPolicy";

const page = async () => {
  const session = await auth();

  const user = session ? await getUserData(session.user?.email) : null;
  return (
    <>
      <PrivacyPolicy user={user} />
    </>
  );
};

export default page;
