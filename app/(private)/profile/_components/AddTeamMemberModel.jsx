import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import TeamMembers from "./TeamMembers";

export default function AddTeamMemberModel({ isOpen, onOpenChange, user }) {
  const [email, setEmail] = useState(""); // Email input value
  const [hasTyped, setHasTyped] = useState(false); // Tracks if the user has started typing

  // Set team members data and update it
  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(false); // Loading state

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Trigger validation only after user starts typing
    if (!hasTyped && value.trim() !== "") {
      setHasTyped(true);
    }
  };

  const handleInvite = async () => {
    if (email.trim() === "") {
      setHasTyped(true); // Show error message
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to send invite.");
      }

      const data = await response.json();
      setTeamMembers(data); // Update team members
      toast.success("Member added successfully. Invitation sent."); // Success message
    } catch (error) {
      console.error("Error inviting member:", error.message);
      // Simulate invite action
      setHasTyped(false); // Reset typing state
      // onOpenChange(false); // Close modal
      Swal.fire({
        icon: "error",
        title: "Error Inviting Member",
        text: `${error.message}`,
      });
    } finally {
      setLoading(false); // Stop loading
      // Simulate invite action
      setEmail("");
      setHasTyped(false); // Reset typing state
      // onOpenChange(false); // Close modal
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
        radius="none"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* if user is team member then show team members */}
              <ModalHeader className="flex flex-col gap-1">
                {!user?.isTeamMember ? "Invite Team Members" : "Team Members"}
              </ModalHeader>
              <ModalBody>
                {!user?.isTeamMember && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleInvite();
                    }}
                    className="flex items-center w-full gap-4 mb-4"
                  >
                    {/* Email Input with Dropdown Inside */}
                    <Input
                      type="email"
                      label="Email"
                      radius="none"
                      value={email}
                      onChange={handleInputChange}
                      className="flex-grow"
                      errorMessage={
                        hasTyped && !isValidEmail(email)
                          ? "Please enter a valid email"
                          : ""
                      }
                      isInvalid={hasTyped && !isValidEmail(email)} // Show error only after typing starts
                    />

                    {/* Invite Button */}
                    <Button
                      onPress={handleInvite}
                      radius="none"
                      size="lg"
                      type="submit"
                      isLoading={loading}
                      className={` ${
                        hasTyped && !isValidEmail(email) ? "mb-[22px]" : "mb-0"
                      } p-7`}
                    >
                      {loading ? "Inviting..." : "Send Invite"}
                    </Button>
                  </form>
                )}
                <TeamMembers
                  teamMembers={teamMembers}
                  setTeamMembers={setTeamMembers}
                  user={user}
                />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
