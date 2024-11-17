"use client";

export default function BadRequest({ message }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-xl font-bold text-center">
        <div className="mb-5">
          <h2 className="text-red-500 text-3xl">Error fetching data</h2>
          <p>{message || "Try refreshing the page or try again later."}</p>
          <small>or contact support for help</small>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
