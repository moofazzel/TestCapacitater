import { Suspense } from "react";
import TeamMemberLoginForm from "./TeamMemberLoginForm";
import TeamMemberLoginSkeleton from "./TeamMemberLoginFormSkeleton";

const TeamLoginMemberPage = () => {
  return (
    <Suspense fallback={<TeamMemberLoginSkeleton />}>
      <TeamMemberLoginForm />
    </Suspense>
  );
};

export default TeamLoginMemberPage;
