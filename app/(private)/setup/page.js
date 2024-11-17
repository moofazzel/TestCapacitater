import { auth } from "@/auth";
import { getUserData } from "@/queries/getUser";
import SetupGoogleSheet from "./_components/SetupGoogleSheet";

const page = async () => {
  const TemplateLink = process.env.TEMPLATE_LINK;
  const session = await auth();

  // Fetch user data asynchronously and wait for the result
  const user = await getUserData(session?.user?.email);
  return (
    <>
      <SetupGoogleSheet TemplateLink={TemplateLink} user={user} />
    </>
  );
};

export default page;
