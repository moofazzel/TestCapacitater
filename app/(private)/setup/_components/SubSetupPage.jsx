"use client";

import { useSearchParams } from "next/navigation";
import MigrateGoogleSheet from "./MigrateGoogleSheet";
import SetupGoogleSheet from "./SetupGoogleSheet";

const SubSetupPage = ({ userData }) => {
  const searchParams = useSearchParams();

  // Check for migrate query parameter
  const isMigrate = searchParams.get("migrate");

  return (
    <>
      {isMigrate ? (
        <MigrateGoogleSheet userData={userData} />
      ) : (
        <SetupGoogleSheet userData={userData} />
      )}
    </>
  );
};

export default SubSetupPage;
