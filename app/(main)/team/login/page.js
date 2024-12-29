import { Suspense } from "react";
import TeamMemberLoginForm from "./TeamMemberLoginForm";

const TeamLoginMemberPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamMemberLoginForm />
    </Suspense>
  );
};

export default TeamLoginMemberPage;
