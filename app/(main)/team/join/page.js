import { Suspense } from "react";
import JoinTeam from "./JoinTeam";
import JoinTeamSkeleton from "./JoinTeamSkeleton";

const JoinTeamPage = () => {
  return (
    <Suspense fallback={<JoinTeamSkeleton />}>
      <JoinTeam />
    </Suspense>
  );
};

export default JoinTeamPage;
