"use client";

import { addResourceToSheet } from "@/actions/resources/addResourceToSheet";
import CloseIcon from "@/components/icons/CloseIcon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

export default function AddResourceModal({ buttonText, resourcesData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  // Format the date to yyyy-mm-dd
  const convertToDateFormat = (dateInput) => {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, "0");
    const day = String(dateInput.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize formatted date as today’s date in yyyy-mm-dd format
  const [formattedDate, setFormattedDate] = useState(
    convertToDateFormat(new Date())
  );

  const formatter = useDateFormatter({ dateStyle: "full" });

  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      setFormattedDate(inputDate);
    } else {
      setFormattedDate(""); // Reset if format is wrong
    }
  };

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...", { duration: 6000 });
    await new Promise((resolve) => setTimeout(resolve, 6000));
    toast.dismiss(refreshToast);
    toast.success("Refresh complete!", { duration: 1000, icon: "✅" });
    router.refresh();
  };

  const addResource = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await addResourceToSheet(formData);
      if (response.status === 200) {
        setSuccessMessage("Resource successfully added.");
        setLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 600));
        handleRefresh();
        handleModalClose();
      } else {
        console.error("Failed to add resources:", response);
        setErrorMessage(response.message || "Failed to add resources.");
        setLoading(false);
        toast.dismiss();
        toast.error("Error occurred during refresh.", {
          duration: 4000,
          icon: "⚠️",
        });
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.dismiss();
      toast.error("Error occurred during refresh.", {
        duration: 4000,
        icon: "⚠️",
      });
      console.error(error);
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
      setSuccessMessage(null);
    }
  };

  // Extract dynamic field names from resourcesData.
  // We assume that any field that is not fixed should be treated as dynamic.
  const dynamicFields = useMemo(() => {
    if (!resourcesData || resourcesData.length === 0) return [];
    const fixedKeys = [
      "id",
      "resource",
      "totalMaxCapacity",
      "dateHired",
      "category",
    ];
    const allKeys = Object.keys(resourcesData[0]);
    return allKeys.filter((key) => !fixedKeys.includes(key));
  }, [resourcesData]);

  return (
    <>
      <Button
        radius="none"
        onClick={handleModalOpen}
        className="flex text-[12px] md:text-[15px] items-center px-3 py-2 md:px-6 md:py-7 font-medium text-white bg-color5 gap-2 shadow-dark-gray"
      >
        New Resource <FaPlus />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
        className="p-5 rounded-none"
        style={{ width: "80%", maxWidth: "550px" }}
      >
        <ModalContent>
          <form onSubmit={addResource}>
            <ModalHeader className="relative">
              <p className="text-xl font-medium text-color02">
                Add New Resource
              </p>
              <span
                onClick={handleModalClose}
                style={{ cursor: "pointer" }}
                className="absolute -top-3 -right-3 position"
              >
                <CloseIcon boxSize={6} color="danger" />
              </span>
            </ModalHeader>
            <ModalBody className="max-h-[35rem]">
              {errorMessage && (
                <div className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-sm">
                  <p className="text-lg font-bold">Warning</p>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="px-4 py-3 text-center text-black bg-green-100 border border-green-500 rounded-sm">
                  <p className="text-lg font-bold">Success</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <input
                  name="resourceName"
                  type="text"
                  placeholder="Name :"
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9  focus:ring-2 focus:ring-color5 focus:outline-none"
                  required
                />

                <input
                  name="category"
                  type="text"
                  placeholder="Category :"
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9 focus:ring-2 focus:ring-color5 focus:outline-none"
                  required
                />

                {/* Render dynamic fields (if any) */}
                {dynamicFields.map((field) => (
                  <input
                    key={field}
                    name={field}
                    type="text"
                    placeholder={`${field} :`}
                    className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9 focus:ring-2 focus:ring-color5 focus:outline-none"
                  />
                ))}

                <input
                  min="5"
                  max="100"
                  step="5"
                  name="totalMaxCapacity"
                  type="number"
                  placeholder="Total Max Capacity (%) :"
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9 focus:ring-2 focus:ring-color5 focus:outline-none"
                  required
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value < 5) e.target.value = 5;
                    else if (value > 100) e.target.value = 100;
                  }}
                />

                <div className="relative">
                  <input
                    id="hireDate"
                    type="date"
                    name="hireDate"
                    value={formattedDate}
                    onChange={handleDateChange}
                    placeholder="YYYY-MM-DD"
                    className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9 focus:ring-2 focus:ring-color5 focus:outline-none w-full pl-5 md:pl-[155px]"
                  />
                  <span className="hidden md:block absolute text-color04 text-[16px] pointer-events-none top-[21px] left-[21px]">
                    Select Hire Date :
                  </span>
                  <p className="text-[16px] text-color02">
                    Selected date:{" "}
                    {formattedDate && !isNaN(new Date(formattedDate).getTime())
                      ? formatter.format(new Date(formattedDate))
                      : "--"}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-[#DD340A] text-white rounded-none px-4 py-2 text-[16px] font-medium"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-color5 text-white rounded-none px-4 py-2 text-[16px] font-medium"
                isLoading={loading}
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
