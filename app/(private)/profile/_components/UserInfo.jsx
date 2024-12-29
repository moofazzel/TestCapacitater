"use client";

import { updateUser } from "@/actions/user";
import DoneIcon from "@/components/icons/DoneIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import StopIcon from "@/components/icons/StopIcon";
import { Button, useDisclosure } from "@nextui-org/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { BsPersonAdd } from "react-icons/bs";

const DynamicAddTeamMemberModel = dynamic(
  () => import("./AddTeamMemberModel"),
  {
    ssr: false,
  }
);

const UserInfo = ({ user, templateLink, googleAuthClientEmail }) => {
  // for the add team member model
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [dealsTabName, setDealsTabName] = useState(
    user?.dealsTabName || "deals"
  );
  const [resourcesTabName, setResourcesTabName] = useState(
    user?.resourcesTabName || "resources"
  );
  const [sheetId, setSheetId] = useState(user.googleSheetId || "N/A");
  const [isDealsEditOpen, setDealsEditOpen] = useState(false);
  const [isResourcesEditOpen, setResourcesEditOpen] = useState(false);
  const [isSheetIdEditOpen, setSheetIdEditOpen] = useState(false);

  const handleDealsTabChange = async () => {
    try {
      const email = user.email;
      setDealsEditOpen(false);
      // Call the server action to update the deals tab name
      const updatedUser = await updateUser(email, {
        deals_tab_name: dealsTabName,
      });
      // Close the edit mode to show the Edit icon again
    } catch (error) {
      console.error("Failed to update deals tab name:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleResourcesTabChange = async () => {
    try {
      const email = user.email;
      setResourcesEditOpen(false);
      // Call the server action to update the deals tab name
      const updatedUser = await updateUser(email, {
        resources_tab_name: resourcesTabName,
      });
      // Close the edit mode to show the Edit icon again
    } catch (error) {
      console.error("Failed to update deals tab name:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleSheetIdChange = async () => {
    try {
      const email = user.email;

      // Extract Sheet ID from the input value (full URL or ID)
      const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/) || [null, sheetId];
      const extractedSheetId = match[1];

      if (!extractedSheetId) {
        console.error("Invalid Google Sheet URL");
        alert("Please enter a valid Google Sheet URL or ID");
        return;
      }

      // Update the database with the extracted Sheet ID
      await updateUser(email, {
        google_sheet_id: extractedSheetId,
      });

      console.log("Sheet ID updated successfully:", extractedSheetId);

      // Update state and exit edit mode
      setSheetId(extractedSheetId);
      setSheetIdEditOpen(false);
    } catch (error) {
      console.error("Failed to update Sheet ID:", error);
      alert("Failed to update Sheet ID");
    }
  };

  if (!user) {
    return <p>Loading...</p>; // replace this with a loader
  }

  return (
    <>
      {" "}
      <div className="container pt-3 mx-auto my-10 overflow-hidden ">
        <div className="px-4 py-5 sm:px-6 ">
          <h3 className="text-3xl font-bold leading-tight text-center text-gray-600 md:text-left">
            User Information
          </h3>
        </div>
        <form className="border-t border-gray-600">
          {/* sheet link */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">Sheet Link</p>
            <div className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              {isSheetIdEditOpen ? (
                <>
                  <input
                    className="w-[450px]"
                    onChange={(e) => setSheetId(e.target.value)}
                    type="text"
                    value={sheetId}
                  />
                  <span className="flex">
                    <DoneIcon onClick={handleSheetIdChange} />
                    <StopIcon onClick={() => setSheetIdEditOpen(false)} />
                  </span>
                </>
              ) : (
                <>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                    target="_blank"
                    title="Go to sheet"
                    style={{ wordBreak: "break-word" }}
                    className="underline hover:text-color01"
                  >
                    https://docs.google.com/spreadsheets/d/{sheetId}/edit
                  </a>
                  <EditIcon onClick={() => setSheetIdEditOpen(true)} />

                  {/* Trigger the add team member model */}
                  <Button
                    onPress={onOpen}
                    className="text-white bg-color5"
                    radius="none"
                  >
                    <BsPersonAdd className="text-2xl" /> Invite
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">
              Deals Tab Name
            </p>
            <div className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              <input
                className="w-20"
                onChange={(e) => setDealsTabName(e.target.value)}
                type="text"
                value={dealsTabName}
                readOnly={!isDealsEditOpen}
                disabled={!isDealsEditOpen}
              />
              {!isDealsEditOpen ? (
                <EditIcon
                  onClick={() => {
                    setDealsEditOpen(true);
                  }}
                />
              ) : (
                <span className="flex">
                  <DoneIcon onClick={handleDealsTabChange} />
                  <StopIcon onClick={() => setDealsEditOpen(false)} />
                </span>
              )}
            </div>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">
              Resources Tab Name
            </p>
            <div className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              <input
                className="w-20"
                onChange={(e) => setResourcesTabName(e.target.value)}
                type="text"
                value={resourcesTabName}
                readOnly={!isResourcesEditOpen}
                disabled={!isResourcesEditOpen}
              />
              {!isResourcesEditOpen ? (
                <EditIcon onClick={() => setResourcesEditOpen(true)} />
              ) : (
                <span className="flex">
                  <DoneIcon onClick={handleResourcesTabChange} />
                  <StopIcon onClick={() => setResourcesEditOpen(false)} />
                </span>
              )}
            </div>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">
              Two Factor Status
            </p>
            <div>
              <label
                htmlFor="two-factor-status"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="two-factor-status"
                  checked={user.twoFactorAuth}
                  className="sr-only peer"
                  readOnly
                />
                <div
                  className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#79D703]`}
                ></div>
                <span className="ml-3 text-[16px] font-medium text-gray-600">
                  {user.twoFactorAuth ? "Activated" : "Deactivated"}
                </span>
              </label>
            </div>
          </div>

          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">
              Subscription Status
            </p>
            <div>
              <label
                htmlFor="subscription-status"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="subscription-status"
                  checked={user.subscriptionStatus}
                  className="sr-only peer"
                  readOnly
                />
                <div
                  className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#79D703]`}
                ></div>
                <span className="ml-3 text-[16px] font-medium text-gray-600">
                  {user.subscriptionStatus ? "Subscribed" : "Not Subscribed"}
                </span>
              </label>
            </div>
          </div>

          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <p className="text-[16px] font-medium text-gray-600">
              Privacy Policy
            </p>
            <p className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 underline cursor-pointer">
              <Link href="/privacy-policy">Read Here</Link>
            </p>
          </div>
        </form>
      </div>
      <DynamicAddTeamMemberModel
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
      />
    </>
  );
};

export default UserInfo;
