"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function GrandPermissionModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleGrantPermission = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/google/consent", { method: "GET" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { url } = await response.json();
      if (url) {
        window.location.href = url; // Redirect to Google OAuth consent page
      } else {
        throw new Error("Invalid URL received from server");
      }
    } catch (error) {
      console.error("Error granting permission:", error);
      // Optionally, display an error message to the user here
      alert("Failed to redirect to Google. Please try again.");
      setIsLoading(false); // Stop loading on error
    }
  };

  return (
    <>
      <Button
        className="px-6 py-2 text-white bg-blue-600 rounded-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        onPress={onOpen}
      >
        Start a new project
      </Button>
      <Modal radius="none" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Start a new project
              </ModalHeader>
              <ModalBody className="text-center">
                <p className="text-gray-600">
                  Please grant access to Google Sheets to continue.
                </p>
                <p className="text-gray-600">
                  You&apos;ll be redirected to Google to authorize your account.
                  Select the account you want to connect with the app.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  radius="none"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isLoading} // Disable cancel button while loading
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleGrantPermission}
                  radius="none"
                  color="primary"
                  isLoading={isLoading} // Show loading spinner
                  disabled={isLoading} // Disable start button while loading
                >
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
