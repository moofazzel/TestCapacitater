"use client";

import { Button, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import GrandPermissionModal from "./GrandPermissionModal";
import JoinATeamModal from "./JoinATeamModal";

export default function SetupGoogleSheet({ userData }) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const email = session?.user?.email;

  // const handleGrantPermission = async () => {
  //   const response = await fetch("/api/google/consent", { method: "GET" });
  //   const { url } = await response.json();
  //   window.location.href = url; // Redirect to Google OAuth consent page
  // };

  const handleSkip = async () => {
    router.push("/app");
  };

  async function handleCreateGoogleSheet() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/google/create-google-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear localStorage on successful setup
        localStorage.clear();
        setIsLoading(false);
        router.refresh();
        toast.success("Setup completed successfully");
      } else {
        console.error("Failed to create Google Sheet:", data.error);
        setIsLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create Google Sheet",
        });
      }
    } catch (error) {
      console.error("Error creating Google Sheet:", error.message);
      setIsLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while creating Google Sheet",
      });
    }
  }

  const googleSheetId = userData.googleSheetId
    ? `https://docs.google.com/spreadsheets/d/${userData.googleSheetId} `
    : null;

  return (
    <section className="container">
      <div className="flex h-[80vh] sm:h-[55vh] flex-col items-center justify-center text-center my-16 md:my-28 bg-gray-50 custom-shadow p-6">
        {userData?.googleSheetPermission && userData?.initialSetupComplete ? (
          // Case 1: Setup Complete
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
              Account Setup Complete
            </h1>
            <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
              <Button
                color="success"
                as={Link}
                href={googleSheetId}
                target="_blank"
                className="px-6 py-2 text-white rounded-none"
              >
                Open Google Sheet
              </Button>
              <Button
                as={Link}
                href="/app"
                className="px-6 py-2 text-white rounded-none bg-color5 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              >
                Go To App
              </Button>
            </div>
          </div>
        ) : userData?.googleSheetPermission ? (
          // Case 2: Permission Granted but Setup Incomplete
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
              Set Up Your Account
            </h1>
            <p className="mt-4 text-success-500">
              Google sheet access permission granted
            </p>
            <p className="mt-4 text-gray-600">
              Please create Google Sheets to continue.
            </p>
            <Button
              isLoading={isLoading}
              color="primary"
              className="px-6 py-2 mt-6 text-white bg-blue-600 rounded-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              onClick={handleCreateGoogleSheet}
            >
              {isLoading ? "Creating Google Sheet..." : "Create Sheet"}
            </Button>
          </div>
        ) : (
          // Case 3: Permission Not Granted
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
              Set Up Your Account
            </h1>
            {/* <p className="mt-4 text-gray-600">
              Please grant access to Google Sheets to continue.
            </p>
            <p className="mt-3 text-gray-600">
              You&apos;ll be redirected to Google to authorize your account.
              Select the account you want to connect with the app.
            </p> */}
            <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
              <GrandPermissionModal />

              {/* <Button
                className="px-6 py-2 text-gray-600 rounded-none border border-gray-400 hover:bg-gray-100"
                // onClick={handleSkip}
              >
                Join a Team
              </Button> */}
              <JoinATeamModal />
            </div>
          </div>
        )}
      </div>
    </section>
    // <section className="container">
    //   <div className="flex h-[80vh] sm:h-[55vh] flex-col items-center justify-center text-center my-16 md:my-28 bg-gray-50 custom-shadow p-6">
    //     {userData?.googleSheetPermission && userData?.initialSetupComplete && (
    //       <div className="flex flex-col items-center">
    //         <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
    //           Account Setup Complete
    //         </h1>

    //         <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
    //           <Button
    //             color="success"
    //             as={Link}
    //             href={googleSheetId}
    //             target="_blank"
    //             className="px-6 py-2 text-white rounded-none"
    //           >
    //             Open Google Sheet
    //           </Button>
    //           <Button
    //             as={Link}
    //             href="/app"
    //             className="px-6 py-2 text-white rounded-none bg-color5 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
    //           >
    //             Go To App
    //           </Button>
    //         </div>
    //       </div>
    //     )}

    //     {userData?.googleSheetPermission && !userData?.initialSetupComplete && (
    //       <>
    //         <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
    //           Set Up Your Account
    //         </h1>
    //         <p className="mt-4 text-success-500">
    //           Google sheet access permission granted
    //         </p>
    //       </>
    //     )}

    //     {!userData?.initialSetupComplete && userData?.googleSheetPermission && (
    //       <div className="flex flex-col items-center">
    //         <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
    //           Set Up Your Account
    //         </h1>
    //         <p className="mt-4 text-gray-600">
    //           Please create Google Sheets to continue.
    //         </p>

    //         <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
    //           <Button
    //             isLoading={isLoading}
    //             color="primary"
    //             className="px-6 py-2 text-white bg-blue-600 rounded-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
    //             onClick={handleCreateGoogleSheet}
    //           >
    //             {isLoading ? "Creating Google Sheet..." : "Create Sheet"}
    //           </Button>
    //         </div>
    //       </div>
    //     )}

    //     {!userData?.googleSheetPermission && (
    //       <div className="flex flex-col items-center">
    //         <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
    //           Set Up Your Account
    //         </h1>
    //         <p className="mt-4 text-gray-600">
    //           Please grant access to Google Sheets to continue.
    //         </p>
    //         <p className="mt-3 text-gray-600">
    //           You&apos;ll be redirected to Google to authorize your account.
    //           Select the account you want to connect with the app.
    //         </p>
    //         <div className="flex flex-col gap-3 mt-6 sm:gap-5 sm:flex-row">
    //           <Button
    //             color="primary"
    //             className="px-6 py-2 text-white bg-blue-600 rounded-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
    //             onClick={handleGrantPermission}
    //           >
    //             Grant Permission
    //           </Button>
    //           <Button
    //             className="px-6 py-2 text-gray-600 rounded-none border border-gray-400 hover:bg-gray-100"
    //             onClick={handleSkip}
    //           >
    //             Skip for Now
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </section>
  );
}
