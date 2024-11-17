"use client";

import { writeNewDealForResources } from "@/actions/writeToGoogleSheet";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AllocateResourceModal({
  buttonText,
  allResources,
  dealId,
  projectName,
  dealResources,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedResources, setSelectedResources] = useState({});
  const [initialSelectedResources, setInitialSelectedResources] = useState({});

  // const [isAllocateResourceModalOpen, setIsAllocateResourceModalOpen] =
  //   useState(false);

  const router = useRouter();

  useEffect(() => {
    const initialSelected = {};
    dealResources.forEach(({ resourceName, dealCapacity }) => {
      const resource = allResources.find(
        (resource) => resource.Resources === resourceName
      );
      if (resource) {
        initialSelected[resourceName] =
          dealCapacity || resource["Total Max Capacity(%)"];
      }
    });
    setSelectedResources(initialSelected);
    setInitialSelectedResources(initialSelected); // Save the initial selection state
  }, [dealResources, allResources]);

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

  const addResource = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Get the resources that were initially selected but are no longer selected
      const deselectedResources = Object.keys(initialSelectedResources)
        .filter(
          (resourceName) => !selectedResources.hasOwnProperty(resourceName)
        )
        .map((resourceName) => ({
          dealId,
          resourceName,
          resourceCapacity: initialSelectedResources[resourceName],
        }));

      const resourcesToAdd = Object.entries(selectedResources).map(
        ([resourceName, capacity]) => ({
          dealId,
          resourceName,
          resourceCapacity: capacity,
        })
      );

      // Make the API call to write the data to Google Sheets
      const response = await writeNewDealForResources(
        resourcesToAdd,
        deselectedResources
      );

      if (response.status === 200) {
        setSuccessMessage("Resources successfully allocated.");

        setLoading(false);
        setRefreshing(true);

        // Simulate a delay for page refresh and show the refreshing toast
        handleRefresh();

        await new Promise((resolve) => setTimeout(resolve, 600)); // .6-second delay

        handleModalClose();
      } else {
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
      setLoading(false);
      setRefreshing(false);
      setSuccessMessage(null);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.dismiss(refreshToast); // Close any existing refresh toast if an error occurs
      // Show error toast
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
      setSelectedResources(initialSelectedResources);
      setSuccessMessage(null);
    }
  };

  const handleCheckboxChange = (resourceName) => {
    setSelectedResources((prev) => {
      const isSelected = prev.hasOwnProperty(resourceName);

      if (isSelected) {
        const updated = { ...prev };
        delete updated[resourceName];
        return updated;
      } else {
        return {
          ...prev,
          [resourceName]:
            allResources.find(
              (resource) => resource.Resources === resourceName
            )?.["Total Max Capacity(%)"] || 0,
        };
      }
    });
  };

  const handleInputChange = (resourceName, value) => {
    setSelectedResources((prev) => ({
      ...prev,
      [resourceName]: value,
    }));
  };

  // Check if any changes were made to the initial selection
  // const hasChanges = () => {
  //   if (Object.keys(selectedResources).length === 0) return false;

  //   if (
  //     Object.keys(selectedResources).length === 0 &&
  //     Object.keys(deselectedResources).length === 0
  //   )
  //     return true;

  //   return (
  //     Object.keys(selectedResources).length !==
  //       Object.keys(initialSelectedResources).length ||
  //     Object.entries(selectedResources).some(
  //       ([resourceName, capacity]) =>
  //         initialSelectedResources[resourceName] !== capacity
  //     )
  //   );
  // };

  // Check if any changes were made to the initial selection
  const hasChanges = () => {
    // Include logic for deselected resources
    const deselectedResources = Object.keys(initialSelectedResources).filter(
      (resourceName) => !selectedResources.hasOwnProperty(resourceName)
    );

    // Enable submit if there are any selected or deselected resources
    return (
      Object.keys(selectedResources).length > 0 ||
      deselectedResources.length > 0
    );
  };

  return (
    <>
      <Button
        className={` bg-transparent text-white font-semibold  max-h-full bg-blue-500f absolute left-0  min-w-full rounded-none z-50`}
        onClick={handleModalOpen}
      >
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
        // backdrop="transparent"
        className="z-[70] "
      >
        <ModalContent>
          <form onSubmit={addResource}>
            <ModalHeader>
              Allocate to
              <span className="ml-1 font-bold underline truncate max-w-[15ch]">
                {projectName}
              </span>
            </ModalHeader>
            <ModalBody className="max-h-[35rem]">
              {errorMessage && (
                <div className="px-4 py-3 text-center text-black bg-red-100 border border-red-500 rounded-lg">
                  <p className="font-bold">Warning</p>
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="px-4 py-3 text-center text-black bg-green-100 border border-green-500 rounded-lg">
                  <p className="text-lg font-bold">Success</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}

              {allResources.length === 0 ? (
                <div className="p-5 font-bold text-center bg-gray-200 rounded-lg">
                  No resources found
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Sort the resources so that selected ones are at the top */}
                  {[...allResources]
                    .sort((a, b) => {
                      const isSelectedA = selectedResources.hasOwnProperty(
                        a.Resources
                      );
                      const isSelectedB = selectedResources.hasOwnProperty(
                        b.Resources
                      );
                      return isSelectedA === isSelectedB
                        ? 0
                        : isSelectedA
                        ? -1
                        : 1; // Move selected items to the top
                    })
                    .map((resource, index) => {
                      const isSelected = selectedResources.hasOwnProperty(
                        resource.Resources
                      );

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2.5 border rounded-lg ${
                            isSelected
                              ? "bg-white border-blue-500"
                              : "bg-gray-100 border-transparent"
                          }  hover:border-blue-500`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              isSelected={isSelected}
                              onChange={() =>
                                handleCheckboxChange(resource.Resources)
                              }
                            >
                              <User
                                description={resource?.Category}
                                name={`${resource.Resources}`}
                              />
                            </Checkbox>
                          </div>
                          <input
                            type="number"
                            name="resourceCapacity"
                            value={
                              selectedResources[resource.Resources] ||
                              parseInt(resource?.["Total Max Capacity(%)"])
                            }
                            onChange={(e) =>
                              handleInputChange(
                                resource.Resources,
                                e.target.value
                              )
                            }
                            readOnly={!isSelected}
                            min="0"
                            max="100"
                            step="5"
                            className={`w-20 h-10 px-2 border rounded 
                  ${
                    !isSelected ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                  }`}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                // Enable only if changes are made
                isDisabled={!hasChanges()}
                type="submit"
                color="primary"
                isLoading={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
