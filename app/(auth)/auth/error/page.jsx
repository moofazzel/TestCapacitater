"use client";

import { useEffect, useState } from "react";

const AuthError = () => {
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the error cookie value
    const getCookie = (name) => {
      const cookies = document.cookie.split("; ");
      const found = cookies.find((row) => row.startsWith(`${name}=`));
      return found ? decodeURIComponent(found.split("=")[1]) : null;
    };

    const errorMessage = getCookie("auth_error");
    if (errorMessage) {
      setError(errorMessage);

      // 🔹 Clear the error cookie after retrieving it
      //   document.cookie =
      //     "auth_error=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  const errorMessages = {
    TEAM_MEMBER_EMAIL_MISMATCH:
      "You are not authorized to join as a team member. Please use the correct email.",
    NO_VALID_INVITATION: "No valid invitation was found for your email.",
    EXPIRED_TEAM_MEMBER_TOKEN:
      "Your invitation token is invalid or has expired.",
    Default: "An unknown authentication error occurred. Please try again.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] bg-gray-100">
      <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>

      <p className="mt-4 text-lg text-gray-800">
        {errorMessages[error] || errorMessages.Default}
      </p>

      <a
        href="#" // Keep it clickable but prevent unwanted navigation
        onClick={(e) => {
          e.preventDefault(); // Prevent default navigation
          window.history.go(-2); // Go back two steps in browser history
        }}
        className="px-4 py-2 mt-6 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Go back
      </a>
    </div>
  );
};

export default AuthError;
