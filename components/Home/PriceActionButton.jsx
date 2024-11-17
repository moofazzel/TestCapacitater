"use client";

import { createCheckoutSession } from "@/actions/stripe";
import Swal from "sweetalert2";

const PriceActionButton = ({ title, priceId }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      const { url } = await createCheckoutSession(data);
      window.location.href = url;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* hidden inputs */}
      <input type="hidden" name="priceId" value={priceId} />
      <button
        type="submit"
        className="px-12 py-3 text-2xl font-semibold text-white mb-[10px] bg-color01"
      >
        <p>{title}</p>
      </button>
    </form>
  );
};

export default PriceActionButton;
