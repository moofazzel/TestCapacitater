"use client";

import { Button, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MigrateGoogleSheet({ userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMigratingLoading, setIsMigratingLoading] = useState(false);

  const router = useRouter();

  const handleGrantPermission = async () => {
    const response = await fetch("/api/google/consent?migrate=true", {
      method: "GET",
    });
    const { url } = await response.json();
    window.location.href = url; // Redirect to Google OAuth consent page
  };

  const handleContinueMigration = async () => {
    setIsMigratingLoading(true);
    try {
      const response = await fetch("/api/google/migrate-sheet-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Migration Successful",
          text: "Your data has been successfully migrated to the new system.",
        });

        router.push("/setup");
        return;
      }

      if (!data.isPublic) {
        Swal.fire({
          icon: "warning",
          title: "Sheet Not Public",
          text: "Your Google Sheet is not publicly available. Please make it public or copy the data manually.",
        });
        return;
      }
    } catch (error) {
      console.error("Error checking sheet access:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check sheet access. Please try again.",
      });
    } finally {
      setIsMigratingLoading(false);
    }
  };

  const handleManualMigration = async () => {
    // SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Manual Migration",
      text: "You will need to copy and paste your old Google Sheet data to the new template manually. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // If user confirms, trigger handleCreateGoogleSheet
      handleCreateGoogleSheet();
    } else {
      Swal.fire({
        icon: "info",
        title: "Migration Cancelled",
        text: "Manual migration process was cancelled.",
      });
    }
  };

  const handleCreateGoogleSheet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/google/create-google-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear(); // Clear local storage after success
        setIsLoading(false);
        toast.success("New Google Sheet created. Copy your data manually.");
        router.push("/setup");
        router.refresh();
      } else {
        console.error("Failed to create Google Sheet:", data.error);
        setIsLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create Google Sheet. Please try again.",
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
  };

  return (
    <section className="container ">
      <div className="flex h-[80vh] sm:h-[55vh] flex-col items-center justify-center text-center my-16 md:my-28 bg-yellow-100 border border-yellow-300 custom-shadow p-6">
        {userData?.googleSheetPermission && userData?.initialSetupComplete && (
          <h2 className="text-2xl font-bold text-yellow-800">
            Done! Migrate to the New System.
          </h2>
        )}

        {!userData?.googleSheetPermission && (
          <>
            <h2 className="text-2xl font-bold text-yellow-800">
              Grant Google Sheets Access
            </h2>
            <p className="mt-4 text-gray-700">
              To migrate your data, please grant access to Google Sheets. You’ll
              be redirected to Google for authorization.
            </p>
            <Button
              color="primary"
              onClick={handleGrantPermission}
              radius="none"
              className="px-6 py-2 mt-6"
            >
              Grant Permission
            </Button>
          </>
        )}

        {!userData?.initialSetupComplete && userData?.googleSheetPermission && (
          <>
            <h2 className="text-2xl font-bold text-yellow-800">
              Migrate to the New System
            </h2>
            <p className="mt-4 text-gray-700">
              To automatically copy your old Google Sheet data, please ensure
              the sheet is{" "}
              <span className="font-semibold">publicly accessible</span>. If you
              prefer, you can manually copy the data to the new system{" "}
              <button className="font-bold underline">click here</button>.
            </p>
            <div className="flex flex-col gap-4 mt-6 sm:flex-row">
              <Button
                color="warning"
                isLoading={isLoading}
                onClick={handleManualMigration}
                radius="none"
                className="px-6 py-2"
              >
                {isLoading ? "Manually Migrating..." : "Migrate Manually"}
              </Button>
              <Button
                color="primary"
                isLoading={isMigratingLoading}
                onClick={handleContinueMigration}
                radius="none"
                className="px-6 py-2"
              >
                {isMigratingLoading ? "Migrating..." : "Continue Migration"}
              </Button>
            </div>
            <p className="mt-6 text-gray-600">
              <Link
                href={`https://docs.google.com/spreadsheets/d/${userData?.googleSheetId}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Go to Current Template
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
