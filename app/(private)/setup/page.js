import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import { redirect } from "next/navigation";
import SubSetupPage from "./_components/SubSetupPage";

const SetupPage = async () => {
  const session = await auth();

  // Fetch user data asynchronously and wait for the result
  const userData = await getUserData(session?.user?.email);

  if (userData?.initialSetupComplete && userData?.googleSheetPermission)
    redirect("/app");
  return (
    <>
      <SubSetupPage userData={userData} />
    </>
  );
};

export default SetupPage;
