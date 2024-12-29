"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const PriceActionButton = ({ title, priceId }) => {
  const router = useRouter();

  const { data: session } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) return router.push("/login");

    try {
      // Send JSON instead of FormData
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      window.location.href = result.url;
    } catch (error) {
      console.log("🚀 ~ error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  return (
    <button
      onClick={handleSubmit}
      className="px-12 py-3 text-2xl font-semibold text-white group-hover:text-black transition-all duration-200 mb-[10px] bg-color01"
    >
      {title}
    </button>
  );
};

export default PriceActionButton;
