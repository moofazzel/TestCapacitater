"use client";

import { insertColumnBeforeFirstDealId } from "@/actions/resources/insertColumnBeforeFirstDealId";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

const AddNewDataFieldToSheet = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [newColumnName, setNewColumnName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    setNewColumnName("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...", { duration: 3000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    toast.dismiss(refreshToast);
    toast.success("Refresh complete!", { duration: 1000, icon: "✅" });
    router.refresh();
  };

  const handleAddNewDataField = async () => {
    // event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await insertColumnBeforeFirstDealId(newColumnName);

      if (response.status === 200) {
        setSuccessMessage(
          response.message || "New data field successfully added"
        );
        setLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 700));
        handleRefresh();
        handleClose();
      } else {
        setErrorMessage(response.message || "Failed to add new data field.");
        setLoading(false);
        toast.dismiss();
        toast.error(
          response.message || "Error occurred while adding new data field.",
          {
            duration: 4000,
            icon: "⚠️",
          }
        );
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Error occurred while adding new data field.", {
        duration: 4000,
        icon: "⚠️",
      });
      console.error("Error adding new data field:", error);
    }
  };

  return (
    <>
      <Button
        radius="none"
        className="flex text-[12px] md:text-[15px] items-center px-3 py-2 md:px-6 md:py-7 font-medium text-white bg-color5 gap-2 shadow-dark-gray"
        onPress={onOpen}
      >
        New Data Field <FaPlus />
      </Button>
      <Modal
        style={{ width: "80%", maxWidth: "550px" }}
        radius="none"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={loading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Data Field
              </ModalHeader>
              <ModalBody>
                {errorMessage && (
                  <div className="px-4 py-3 text-center text-black bg-red-100 rounded-sm border border-red-500">
                    <p className="text-lg font-bold">Warning</p>
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="px-4 py-3 text-center text-black bg-green-100 rounded-sm border border-green-500">
                    <p className="text-lg font-bold">Success</p>
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}
                <form>
                  <div className="flex flex-wrap gap-4 w-full md:flex-nowrap">
                    <Input
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      radius="none"
                      label="New Data Field"
                      type="text"
                    />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  radius="none"
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                >
                  Close
                </Button>
                <Button
                  onClick={handleAddNewDataField}
                  disabled={loading}
                  isLoading={loading}
                  radius="none"
                  color="primary"
                  type="button"
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddNewDataFieldToSheet;
