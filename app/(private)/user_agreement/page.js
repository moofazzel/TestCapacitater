import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import UserAgreement from "./_components/UserAgreement";

const page = async () => {
  const session = await auth();

  // Fetch user data asynchronously and wait for the result
  const user = await getUserData(session?.user?.email);
  return (
    <>
      <UserAgreement user={user} />
    </>
  );
};

export default page;
