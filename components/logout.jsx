"use client";
import { signOut } from "next-auth/react";
const Logout = ({ children }) => {
  return (
    <button
      // className="text-black  border border-black rounded-lg px-4 py-2"
      onClick={() => {
        signOut();
      }}
    >
      Log Out
    </button>
  );
};

export default Logout;
