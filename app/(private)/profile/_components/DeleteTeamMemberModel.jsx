"use client";

import CloseIcon from "@/components/icons/CloseIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTeamMemberModel({ memberEmail, setTeamMembers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/team/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberEmail }), // Pass the email directly
      });

      const data = await response.json();

      setTeamMembers(data); // Update the team members list

      router.refresh();
      setIsOpen(false); // Close the modal after successful deletion
    } catch (err) {
      console.error("Error deleting member:", err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    setIsOpen(true);
    setErrorMessage(null);
  };

  const handleModalClose = () => {
    if (!loading) {
      setIsOpen(false);
      setErrorMessage(null);
    }
  };

  return (
    <>
      <Button
        onClick={handleModalOpen}
        className="min-w-0 p-0 m-0 text-lg bg-transparent text-danger"
      >
        <DeleteIcon />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
        className="p-5 rounded-none"
        style={{ width: "80%", maxWidth: "600px" }}
      >
        <ModalContent>
          <ModalHeader className="relative text-xl font-medium text-color02">
            Delete Member
            <span
              onClick={handleModalClose}
              style={{ cursor: "pointer" }}
              className="absolute -right-3 position -top-3"
            >
              <CloseIcon boxSize={6} />
            </span>
          </ModalHeader>
          <ModalBody>
            {errorMessage && (
              <div className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-lg">
                <p className="text-lg font-bold">Warning</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <p className="text-md text-color01 md:whitespace-nowrap">
              Remove this member{" "}
              <span className="font-bold text-color5">{memberEmail}</span>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-[#DD340A] text-white rounded-none px-4 py-2 text-[16px] font-medium"
              isLoading={loading}
              onClick={handleDelete} // Removed incorrect parameter passing
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
