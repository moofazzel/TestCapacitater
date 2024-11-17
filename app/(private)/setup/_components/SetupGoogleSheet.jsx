"use client";

import { updateUser } from "@/actions/user";
import templatePic from "@/public/template.png";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const VALID_TEMPLATE_ID = "1jK7b7P1B2pprLERN9Bz5VBQYVYzn4-J_u8uKRTz7ywA";

const SetupGoogleSheet = ({ TemplateLink, user }) => {
  const [sheetId, setSheetId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValidSheetIdFormat = (id) => {
    const regex = /^[a-zA-Z0-9_-]{44}$/;
    return regex.test(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // Validate Sheet ID
    if (!sheetId) {
      setErrorMessage("Please provide a Sheet ID.");
      setLoading(false);
      return;
    }

    if (sheetId === VALID_TEMPLATE_ID) {
      setErrorMessage(
        "The provided Sheet ID matches the template ID. Please use a different Sheet ID."
      );
      setLoading(false);
      return;
    }

    if (!isValidSheetIdFormat(sheetId)) {
      setErrorMessage(
        "The provided Sheet ID is not valid. Please enter a valid Google Sheet ID."
      );
      setLoading(false);
      return;
    }

    try {
      const email = user.email;

      const updatedUser = await updateUser(email, {
        initial_setup_complete: true,

        google_sheet_id: sheetId,
      });

      if (updatedUser) {
        Swal.fire({
          icon: "success",
          title: "Setup Complete",
          text: "Navigate to Calendar page to view your data.",
        });

        router.push("/app");
      }
    } catch (error) {
      console.error("Failed to update Setup Status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-5 py-10 mt-10 space-y-6 bg-white shadow-medium rounded-xl">
      <h2 className="text-2xl font-bold">Setup Your Google Sheet</h2>
      <p className="text-gray-600">
        Follow the steps below to complete your setup:
      </p>

      <ol className="pl-5 space-y-3 list-decimal">
        <li>
          <strong>Copy the Google Sheet Template:</strong>
          <ul className="pl-5 list-disc list-inside">
            <li>
              Open the Google Sheet template{" "}
              <Link href={TemplateLink} target="_blank">
                <span className="font-bold text-green-500">Click Here</span>
              </Link>
            </li>
            <li>Click `File` &gt; Make a copy.</li>
            <li>Save the copy to your Google Drive.</li>
          </ul>
        </li>
        <li>
          <strong>Share the Sheet:</strong>
          <ul className="pl-5 list-disc list-inside">
            <li>Open the copied sheet.</li>
            <li>Click `Share`.</li>
            <li>
              Share with email{" "}
              <code className="font-bold text-green-500">
                savvy-software@capacitater.iam.gserviceaccount.com
              </code>
            </li>
          </ul>
        </li>
        <li>
          <strong>Provide the Sheet ID:</strong>
          <ul className="pl-5 list-disc list-inside">
            <li>Copy the Sheet ID from the URL of your Google Sheet.</li>
            <Image
              className="w-3/6 my-4"
              src={templatePic}
              alt="screenshot"
            ></Image>
            <li>
              Below input the Sheet ID.(Don{"'"}t Copy the Template Id from
              Screenshot)
            </li>
          </ul>
        </li>
      </ol>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <Input
          value={sheetId}
          onChange={(e) => setSheetId(e.target.value)}
          label="Google Sheet ID"
          placeholder="Enter your Google Sheet ID here"
          radius="sm"
          isRequired
        />

        <div className="flex justify-center">
          {loading ? (
            <Button isLoading color="primary" size="lg" radius="sm">
              Submitting...
            </Button>
          ) : (
            <Button type="submit" size="lg" radius="sm" color="primary">
              Finish
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SetupGoogleSheet;
