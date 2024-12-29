"use client";

import { deleteResourceFromSheet } from "@/actions/resources/deleteResourceFromSheet";
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

export default function DeleteResourceModal({ resourceName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await deleteResourceFromSheet(resourceName);

      if (response.status === 200) {
        setSuccessMessage("Resource successfully deleted.");

        setLoading(false);
        setRefreshing(true);

        // Simulate a delay for page refresh
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay

        // Refresh the page or re-fetch data after deleting the resource
        router.refresh();

        setRefreshing(false);
        // handleModalClose();
      } else {
        setErrorMessage(response.message || "Failed to delete resources.");
        setSuccessMessage(null);
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setLoading(false);
      setRefreshing(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSuccessMessage(null);
      console.error(error);
    }
  };

  const handleModalOpen = () => {
    setIsOpen(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModalClose = () => {
    if (!loading) {
      setIsOpen(false);
      setErrorMessage(null);
      setSuccessMessage(null);
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
            Delete Resource
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
            {successMessage && (
              <div className="px-4 py-3 text-center text-black bg-green-100 border border-green-500 rounded-lg">
                <p className="text-lg font-bold">Success</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
            <p className="text-lg text-color01 md:whitespace-nowrap">
              Are you sure you want to delete the resource{" "}
              <span className="font-bold text-color5">{resourceName}</span>?
            </p>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="default" variant="light" onClick={handleModalClose}>
              Cancel
            </Button> */}
            <Button
              className="bg-[#DD340A] text-white rounded-none px-4 py-2 text-[16px] font-medium"
              isLoading={loading}
              onClick={handleDelete}
            >
              {refreshing
                ? "Refreshing..."
                : loading
                ? "Deleting..."
                : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
