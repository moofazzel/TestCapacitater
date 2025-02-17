"use client";

import { updateUser } from "@/actions/user";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

// const DynamicAddTeamMemberModel = dynamic(
//   () => import("./AddTeamMemberModel"),
//   {
//     ssr: false,
//   }

// );

const UserInfo = ({ user }) => {
  // for the add team member model
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [dealsTabName, setDealsTabName] = useState(
    user?.dealsTabName || "deals"
  );
  const [resourcesTabName, setResourcesTabName] = useState(
    user?.resourcesTabName || "resources"
  );
  const [sheetId, setSheetId] = useState(user.googleSheetId || "N/A");
  // const [isDealsEditOpen, setDealsEditOpen] = useState(false);
  // const [isResourcesEditOpen, setResourcesEditOpen] = useState(false);
  const [isSheetIdEditOpen, setSheetIdEditOpen] = useState(false);

  // const handleDealsTabChange = async () => {
  //   try {
  //     const email = user.email;
  //     setDealsEditOpen(false);
  //     // Call the server action to update the deals tab name
  //     const updatedUser = await updateUser(email, {
  //       deals_tab_name: dealsTabName,
  //     });
  //     // Close the edit mode to show the Edit icon again
  //   } catch (error) {
  //     console.error("Failed to update deals tab name:", error);
  //     // Handle the error (e.g., show an error message to the user)
  //   }
  // };

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
      <div className="overflow-hidden pt-3 mx-auto">
        {/* <div className="px-4 py-5 sm:px-6">
          <h3 className="text-3xl font-bold leading-tight text-center text-gray-600 md:text-left">
            User Information
          </h3>
        </div> */}
        <form className="pt-5 space-y-5 border-t border-gray-600">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <p className="text-[16px] font-medium text-gray-600">
              Display Name
            </p>
            <p className="mt-1 text-[16px] capitalize  text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              {user?.memberName || user?.ownerName}
            </p>
          </div>

          {/* subscription info */}
          {user?.subscriptionData ? (
            <>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <p className="text-[16px] font-medium text-gray-600">
                  Subscription Status
                </p>
                <p className="mt-1 text-[16px] capitalize  text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
                  {user?.subscriptionData?.status}
                </p>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <p className="text-[16px] font-medium text-gray-600">
                  Account Subscription
                </p>
                <p className="mt-1 text-[16px] capitalize  text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
                  {user?.subscriptionData?.planName}
                </p>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <p className="text-[16px] font-medium text-gray-600">
                  Next Payment Date
                </p>
                <p className="mt-1 text-[16px] capitalize text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
                  {user?.subscriptionData?.currentPeriodEnd
                    ? new Date(
                        user.subscriptionData.currentPeriodEnd
                      ).toLocaleDateString("en-US", {
                        month: "short", // "Feb"
                        day: "2-digit", // "21"
                        year: "numeric", // "2025"
                      })
                    : "N/A"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <p className="text-[16px] font-medium text-gray-600">
                  Account Subscription
                </p>
                <p className="mt-1 text-[16px] capitalize font-semibold text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
                  None
                </p>
              </div>
            </>
          )}

          {/* deals tab name */}
          {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <p className="text-[16px] font-medium text-gray-600">
              Deals Tab Name
            </p>
            <div className="mt-1 text-[16px]  text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              {dealsTabName}
              <input
                className="w-20 bg-transparent"
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
          </div> */}
          {/* resources tab name */}
          {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <p className="text-[16px] font-medium text-gray-600">
              Resources Tab Name
            </p>
            <div className="mt-1 text-[16px]  text-gray-600 sm:mt-0 sm:col-span-2 flex gap-6 justify-start items-center">
              {resourcesTabName}
              <input
                className="w-20 bg-transparent"
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
          </div> */}
          {/* two factor status */}
          {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <p className="text-[16px] font-medium text-gray-600">
              Two Factor Status
            </p>
            <div>
              <label
                htmlFor="two-factor-status"
                className="inline-flex relative items-center cursor-pointer"
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
          </div> */}

          <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <p className="text-[16px] font-medium text-gray-600">
              Privacy Policy
            </p>
            <p className="mt-1 text-[16px]  text-gray-600 sm:mt-0 sm:col-span-2 underline cursor-pointer">
              <Link href="/privacy-policy">Read Here</Link>
            </p>
          </div>
        </form>
      </div>
      {/* <DynamicAddTeamMemberModel
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        user={user}
      /> */}
    </>
  );
};

export default UserInfo;
