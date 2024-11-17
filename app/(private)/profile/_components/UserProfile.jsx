"use client";

import { updateUser } from "@/actions/user";
import DoneIcon from "@/components/icons/DoneIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import StopIcon from "@/components/icons/StopIcon";
import Link from "next/link";
import { useState } from "react";

const UserProfile = ({ user, templateLink, googleAuthClientEmail }) => {
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
      setSheetIdEditOpen(false);
      // Call the server action to update the deals tab name
      const updatedUser = await updateUser(email, {
        google_sheet_id: sheetId,
      });
      // Close the edit mode to show the Edit icon again
    } catch (error) {
      console.error("Failed to update deals tab name:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  if (!user) {
    return <p>Loading...</p>; // You can replace this with a loader if desired
  }

  return (
    <div className="container pt-3 mx-auto my-10 overflow-hidden shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-3xl font-bold leading-tight text-center text-gray-600 md:text-left">
          User Information
        </h3>
      </div>
      <form className="border-t border-gray-600">
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
            />
            {!isDealsEditOpen ? (
              <EditIcon
                onClick={() => {
                  setDealsEditOpen(true);
                }}
              />
            ) : (
              <span className="flex gap-1">
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
            />
            {!isResourcesEditOpen ? (
              <EditIcon onClick={() => setResourcesEditOpen(true)} />
            ) : (
              <span className="flex gap-1">
                <DoneIcon onClick={handleResourcesTabChange} />
                <StopIcon onClick={() => setResourcesEditOpen(false)} />
              </span>
            )}
          </div>
        </div>

        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <p className="text-[16px] font-medium text-gray-600">Sheet Id</p>
          <div className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
            <input
              className="w-[450px]"
              onChange={(e) => setSheetId(e.target.value)}
              type="text"
              value={sheetId} // Use the sheetId state here
              readOnly={!isSheetIdEditOpen}
            />
            {!isSheetIdEditOpen ? (
              <EditIcon onClick={() => setSheetIdEditOpen(true)} />
            ) : (
              <span className="flex gap-1">
                <DoneIcon onClick={handleSheetIdChange} />
                <StopIcon onClick={() => setSheetIdEditOpen(false)} />
              </span>
            )}
          </div>
        </div>

        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <p className="text-[16px] font-medium text-gray-600">Template Link</p>
          <p className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2">
            {templateLink}
          </p>
        </div>
        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <p className="text-[16px] font-medium text-gray-600">
            Api Email for Google Sheet Access
          </p>
          <p className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2">
            {googleAuthClientEmail}
          </p>
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
            <Link href="/privacy_policy">Read Here</Link>
          </p>
        </div>

        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <p className="text-[16px] font-medium text-gray-600">
            User Agreement
          </p>
          <p className="mt-1 text-[16px] font-semibold text-gray-600 sm:mt-0 sm:col-span-2 underline cursor-pointer">
            <Link href="/user_agreement">Read Here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
