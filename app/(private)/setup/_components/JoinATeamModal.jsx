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

export default function JoinATeamModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleGrantPermission = async () => {
    const response = await fetch("/api/google/consent", { method: "GET" });
    const { url } = await response.json();
    window.location.href = url; // Redirect to Google OAuth consent page
  };

  return (
    <>
      <Button
        className="px-6 py-2 text-white bg-blue-600 rounded-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        onPress={onOpen}
      >
        Join a Team
      </Button>
      <Modal radius="none" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join a Team
              </ModalHeader>
              <ModalBody className="text-center">
                <p className="text-gray-600">
                  Joining a team requires an invitation from an admin. Please
                  contact your administrator for access
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  radius="none"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
