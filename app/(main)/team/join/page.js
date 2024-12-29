import { Suspense } from "react";
import JoinTeam from "./JoinTeam";

const JoinTeamPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinTeam />
    </Suspense>
  );
};

export default JoinTeamPage;
