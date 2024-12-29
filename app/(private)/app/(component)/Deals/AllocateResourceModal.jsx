"use client";

import { addCommentToDeal } from "@/actions/comments";
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
import { formatDate } from "../../(utils)";
import AllDealComments from "./AllDealComments";

export default function AllocateResourceModal({
  buttonText,
  allResources,
  dealId,
  projectName,
  dealResources,
  deal,

  setIsAllocateResourceModalOpen,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedResources, setSelectedResources] = useState({});
  const [initialSelectedResources, setInitialSelectedResources] = useState({});

  const [tab, setTab] = useState("resources");

  const [comment, setComment] = useState("");

  const [newCommentState, setNewCommentState] = useState(false);

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
    toast.dismiss(refreshToast); // Close the refreshing toast once done

    // Show success toast when refresh is done
    toast.success("Refresh complete!", {
      duration: 1000, // Duration of the success message
      icon: "✅",
    });
    router.refresh();
  };

  // add allocate resource
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

        // Simulate a delay for page refresh and show the refreshing toast
        handleRefresh();

        await new Promise((resolve) => setTimeout(resolve, 600)); // .6-second delay

        handleModalClose();
      } else {
        setErrorMessage(response.message || "Failed to add resources.");
        setSuccessMessage(null);
        setLoading(false);
        handleRefresh(); // Close any existing refresh toast if an error occurs
        // Show error toast
        toast.error("Error occurred during refresh.", {
          duration: 4000,
          icon: "⚠️",
        });
      }
    } catch (error) {
      setLoading(false);
      setSuccessMessage(null);
      setErrorMessage("An unexpected error occurred. Please try again.");
      handleRefresh(); // Close any existing refresh toast if an error occurs
      // Show error toast
      toast.error("Error occurred during refresh.", {
        duration: 4000,
        icon: "⚠️",
      });
      console.error(error);
    }
  };

  // add comment to deal
  const handleCommentSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setNewCommentState(false);
      const res = await addCommentToDeal(dealId, comment);

      if (res.success) {
        toast.success(res.message);
        setComment("");
        setNewCommentState(true);
      } else {
        toast.error(res.message);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ error:", error);
      toast.error(error.message);
    }
  };

  const handleModalOpen = () => {
    setIsOpen(true);
    setErrorMessage(null);
    setIsAllocateResourceModalOpen(true);
  };

  const handleModalClose = () => {
    if (!loading) {
      setIsOpen(false);
      setErrorMessage(null);
      setSelectedResources(initialSelectedResources);
      setSuccessMessage(null);
      setIsAllocateResourceModalOpen(false);
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
  const hasChanges = () => {
    // Include logic for deselected resources
    const deselectedResources = Object.keys(initialSelectedResources).filter(
      (resourceName) => !selectedResources.hasOwnProperty(resourceName)
    );

    // Enable submit if there are any selected or deselected resources
    return (
      Object.keys(selectedResources).length > 0 ||
      deselectedResources.length > 0 ||
      comment.length > 0
    );
  };

  const truncateText = (text, width) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    let truncatedText = text;
    while (
      context.measureText(truncatedText).width > width &&
      truncatedText.length > 0
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    return truncatedText + (truncatedText !== text ? "..." : "");
  };

  return (
    <>
      <Button
        className={` bg-transparent text-white font-semibold  max-h-full absolute left-0  min-w-full rounded-none z-[70]`}
        onClick={handleModalOpen}
      >
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isKeyboardDismissDisabled={false}
        isDismissable={false}
        scrollBehavior="inside"
        // backdrop="transparent"
        radius="none"
        className="!z-[70]"
        style={{
          zIndex: 70,
        }}
      >
        <ModalContent>
          <form onSubmit={addResource}>
            <ModalHeader></ModalHeader>
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

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setTab("resources")}
                  className={` ${
                    tab === "resources"
                      ? "bg-color5 text-white"
                      : "text-color02"
                  } flex-1 py-3  border px-7 border-color5 `}
                  type="button"
                >
                  Resources
                </button>

                <button
                  onClick={() => setTab("comments")}
                  className={` ${
                    tab === "comments" ? "bg-color5 text-white" : "text-color02"
                  } flex-1 py-3  border px-7 border-color5 `}
                  type="button"
                >
                  Details
                </button>
              </div>

              {/* deal resources */}
              {tab === "resources" && (
                <>
                  <div
                    className="pt-3 pb-4 text-lg text-color02"
                    title={projectName}
                  >
                    Allocate to{" "}
                    {/* <span className="underline truncate max-w-[15ch]">
                  {projectName}
                </span> */}
                    {truncateText(projectName, 140)}
                  </div>
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
                              className={`flex items-center justify-between pt-1.5 px-2.5    ${
                                isSelected
                                  ? "bg-color10 border border-color5"
                                  : "bg-white border-color07 hover:border-color1 border"
                              }  `}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  className="p-0 m-0"
                                  isSelected={isSelected}
                                  onChange={() =>
                                    handleCheckboxChange(resource.Resources)
                                  }
                                  radius="none"
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
                                className={`w-16 h-8 px-2 border border-color07 
                  ${
                    !isSelected
                      ? "bg-white cursor-not-allowed"
                      : "bg-white !border-color5 !border"
                  }`}
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* Deal comments */}
              {tab === "comments" && (
                <div className="flex flex-col gap-4">
                  {/* Deal name */}
                  <h3 className="text-xl font-semibold ">{deal["Project"]}</h3>
                  {/* Deal ID */}
                  <div className="text-base ">
                    <span className="text-color01">Deal ID:</span>{" "}
                    <span className="text-color03">{deal["Deal ID"]}</span>
                  </div>

                  {/* Deal stage */}
                  <div className="text-base ">
                    <span className="text-color01">Deal Stage</span>{" "}
                    <span className="text-color03">{deal["Deal Stage"]}</span>
                  </div>

                  {/* Client */}
                  <div className="text-base ">
                    <span className="text-color01">Client:</span>{" "}
                    <span className="text-color03">{deal["Client"]}</span>
                  </div>

                  {/* Deal dates */}
                  <div className="flex items-center gap-2 px-5 py-2 text-sm bg-white border border-color02 max-w-fit">
                    <span className="text-color02">
                      {formatDate(deal["Start Date"])}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M6.30592 0.308161C6.11004 0.505537 6 0.773199 6 1.05229C6 1.33138 6.11004 1.59904 6.30592 1.79641L11.4779 7.00635L6.30592 12.2163C6.11559 12.4148 6.01028 12.6807 6.01266 12.9566C6.01504 13.2326 6.12492 13.4966 6.31865 13.6917C6.51237 13.8869 6.77443 13.9976 7.04839 14C7.32235 14.0024 7.58628 13.8963 7.78334 13.7045L13.6941 7.75048C13.89 7.55311 14 7.28544 14 7.00635C14 6.72727 13.89 6.4596 13.6941 6.26223L7.78334 0.308161C7.5874 0.110846 7.32169 -2.91918e-07 7.04463 -3.04029e-07C6.76757 -3.16139e-07 6.50186 0.110846 6.30592 0.308161Z"
                        fill="#373737"
                      />
                      <path
                        d="M12.5 8C13.0523 8 13.5 7.55228 13.5 7C13.5 6.44772 13.0523 6 12.5 6V8ZM12.5 6H0V8H12.5V6Z"
                        fill="#555555"
                      />
                    </svg>
                    <span className="text-color02">
                      {formatDate(deal["End Date"])}
                    </span>
                  </div>

                  <div className="mt-1">
                    <div className="flex justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <svg
                          width="24"
                          height="24"
                          role="presentation"
                          focusable="false"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 5C2.8955 5 2 5.89543 2 7C2 8.1045 2.89543 9 4 9C5.1045 9 6 8.10457 6 7C6 5.8955 5.10457 5 4 5Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M4 13C2.8955 13 2 13.8954 2 15C2 16.1045 2.89543 17 4 17C5.1045 17 6 16.1046 6 15C6 13.8955 5.10457 13 4 13Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M8 6C8 5.44772 8.44772 5 9 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H9C8.44772 7 8 6.55228 8 6Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44771 11 9 11H18C18.5523 11 19 10.5523 19 10C19 9.44772 18.5523 9 18 9H9Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M8 14C8 13.4477 8.44772 13 9 13H21C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H9C8.44772 15 8 14.5523 8 14Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44771 19 9 19H18C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17H9Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        Activity
                      </div>
                      <div> {comment.length}/1000</div>{" "}
                    </div>
                    <textarea
                      name="comment"
                      value={comment}
                      placeholder="Text"
                      onChange={(e) => setComment(e.target.value)}
                      rows="2"
                      maxLength={1000}
                      className="w-full p-2 mt-2 border rounded-none bg-color10 border-color05 focus:outline-color5 focus:ring-0 focus:rounded-none"
                    ></textarea>

                    {comment.length === 1000 && (
                      <div className="text-sm text-red-500">
                        Max 1000 characters
                      </div>
                    )}
                  </div>

                  {
                    <AllDealComments
                      dealId={dealId}
                      newCommentState={newCommentState}
                    />
                  }
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="solid"
                radius="none"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              {tab === "resources" && (
                <Button
                  className="text-white bg-color5"
                  // Enable only if changes are made
                  isDisabled={!hasChanges()}
                  type="submit"
                  radius="none"
                  // variant="solid"
                  isLoading={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              )}
              {tab === "comments" && (
                <Button
                  onClick={handleCommentSubmit}
                  className="text-white bg-color5"
                  // Enable only if changes are made
                  isDisabled={comment.trim().length === 0}
                  type="button"
                  radius="none"
                  // variant="solid"
                  isLoading={loading}
                >
                  {loading ? "Commenting..." : "Comment"}
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
