"use client";

import { Tab, Tabs } from "@nextui-org/react";
import TeamSetup from "./TeamSetup";
import UserInfo from "./UserInfo";

const ProfilePageTabs = ({ user }) => {
  return (
    <section className="container h-[70vh]">
      <Tabs radius="none" aria-label="Options">
        <Tab key="user Information" title="User Information">
          <UserInfo user={user} />
        </Tab>
        <Tab key="team Setup" title="Team Setup">
          <TeamSetup user={user} />
        </Tab>
      </Tabs>
    </section>
  );
};

export default ProfilePageTabs;
