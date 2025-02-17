"use client";

import { EditIcon } from "@/components/icons/EditIcon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

import { updateResourceToSheet } from "@/actions/resources/updateResourceToSheet";
import CloseIcon from "@/components/icons/CloseIcon";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditResourcesModal({ buttonText, resourceData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  const handleRefresh = async () => {
    //  show loading toast while refreshing
    const refreshToast = toast.loading("Refreshing...", {
      duration: 6000,
    });

    // Simulate a delay for page refresh
    await new Promise((resolve) => setTimeout(resolve, 6000)); // 6-second delay

    // Dismiss the loading toast and proceed with refreshing
    setRefreshing(false);
    toast.dismiss(refreshToast); // Close the refreshing toast once done

    // Show success toast when refresh is done
    toast.success("Refresh complete!", {
      duration: 1000, // Duration of the success message
      icon: "✅",
    });
    router.refresh();
  };

  // Function to convert "1 May 2024" to "2024-05-01"
  const convertToDateFormat = (dateStr) => {
    const dateParts = dateStr.split(" ");
    const day = String(dateParts[0]).padStart(2, "0");
    const month = new Date(`${dateParts[1]} 1, 2000`).getMonth() + 1;
    const year = dateParts[2];
    return `${year}-${String(month).padStart(2, "0")}-${day}`;
  };

  const todayDate = new Date().toISOString().split("T")[0];

  let formateDate;
  if (
    !resourceData?.dateHired ||
    resourceData.dateHired.includes("NaN") ||
    !convertToDateFormat(resourceData.dateHired)
  ) {
    formateDate = format(new Date(), "yyyy-MM-dd");
  } else {
    formateDate = convertToDateFormat(resourceData.dateHired);
  }
  const [formattedDate, setFormattedDate] = useState(formateDate);

  const handleDateChange = (e) => {
    const inputDate = e.target.value;

    // Ensure the format is correct (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      setFormattedDate(inputDate);
    } else {
      setFormattedDate(""); // Reset if format is wrong
    }
  };

  const updateResource = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    //  show loading toast while refreshing
    const refreshToast = toast.loading("Refreshing...", {
      duration: 6000,
    });

    try {
      // Make the API call to write the data to Google Sheets
      const response = await updateResourceToSheet(formData);

      if (response.status === 200) {
        setSuccessMessage("Resource successfully updated.");

        setLoading(false);
        setRefreshing(true);

        // Simulate a delay for page refresh
        await new Promise((resolve) => setTimeout(resolve, 500)); // .5-second delay

        // Simulate a delay for page refresh and show the refreshing toast
        handleRefresh();

        handleModalClose();
      } else {
        console.error("Failed to add resources:", response);
        setErrorMessage(response.message || "Failed to add resources.");
        setSuccessMessage(null);
        setLoading(false);
        setRefreshing(false);
        toast.dismiss(refreshToast); // Close any existing refresh toast if an error occurs
        // Show error toast
        toast.error("Error occurred during refresh.", {
          duration: 4000,
          icon: "⚠️",
        });
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setLoading(false);
      setRefreshing(false);
      setSuccessMessage(null);
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);

      toast.dismiss(refreshToast); // Close any existing refresh toast if an error occurs
      // Show error toast
      toast.error("Error occurred during refresh.", {
        duration: 4000,
        icon: "⚠️",
      });
    }
  };

  // Extract dynamic field names from resourcesData.
  // We assume that any field that is not fixed should be treated as dynamic.
  const dynamicFields = useMemo(() => {
    const fixedKeys = [
      "id",
      "resource",
      "totalMaxCapacity",
      "dateHired",
      "category",
    ];
    const allKeys = Object.keys(resourceData);
    return allKeys.filter((key) => !fixedKeys.includes(key));
  }, [resourceData]);

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

  return (
    <>
      <Button
        onClick={handleModalOpen}
        className="min-w-0 p-0 m-0 text-lg bg-transparent"
      >
        <EditIcon />
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
          <form onSubmit={updateResource}>
            <ModalHeader className="relative">
              <p className="text-xl font-medium text-color02">
                Update Resource
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

              <div className="flex flex-col gap-3">
                <input
                  name="resourceName"
                  type="text"
                  placeholder=""
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9  focus:ring-2 focus:ring-color5 focus:outline-none"
                  required
                  readOnly
                  defaultValue={`${resourceData?.resource}`}
                />
                <input
                  defaultValue={`${resourceData?.category}`}
                  name="category"
                  type="text"
                  placeholder=""
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9  focus:ring-2 focus:ring-color5 focus:outline-none"
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
                  defaultValue={resourceData?.totalMaxCapacity}
                  min="5"
                  max="100"
                  step="5"
                  name="totalMaxCapacity"
                  type="number"
                  placeholder="Total Max Capacity (%) :"
                  className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9  focus:ring-2 focus:ring-color5 focus:outline-none"
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
                    className="text-color04 text-[16px] rounded-none p-5 border border-color05 focus:border-color5 focus:bg-color9  focus:ring-2 focus:ring-color5 focus:outline-none w-full pl-5"
                  />
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
                // Enable only if changes are made
                type="submit"
                className="bg-color5 text-white rounded-none px-4 py-2 text-[16px] font-medium"
                isLoading={refreshing || loading}
              >
                {refreshing
                  ? "Refreshing..."
                  : loading
                  ? "Updating..."
                  : "Update"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
