import { auth } from "@/auth";
import { StripeSubscription } from "@/models/stripeSubscriptions-model";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FaCheckCircle } from "react-icons/fa";
import { IoMdReturnLeft } from "react-icons/io";

export default async function PaymentSuccess({ searchParams }) {
  // Authenticate the user
  const userSession = await auth();
  if (!userSession) {
    redirect("/login");
  }

  // Get session_id from query parameters for tracking purposes
  const session_id = searchParams?.session_id;
  if (!session_id) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Invalid Payment Session
        </h1>
        <p>
          Invalid session data. Please contact support if you believe this is an
          error.
        </p>
      </div>
    );
  }

  // Fetch the user's subscription data from the database
  const subscription = await StripeSubscription.findOne({
    userId: userSession.user.id,
  });

  if (!subscription) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Error</h1>
        <p>No active subscription found. Please contact support.</p>
      </div>
    );
  }

  // Check the status from the database
  if (subscription.status !== "active") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-yellow-600">Payment Pending</h1>
        <p>Your payment is being processed. Please wait or contact support.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center text-7xl text-color5">
        <FaCheckCircle />
      </div>

      <h1 className="mt-5 text-3xl font-bold">Payment Successful!</h1>

      <p className="mt-4 text-lg">
        Thank you for your purchase, your subscription is now active!
      </p>

      <div className="max-w-6xl mx-auto">
        <h3 className="mt-5 mb-2 text-2xl font-medium text-left text-color03">
          Subscription #
        </h3>
        <div className="flex justify-between">
          <div className="flex-1 p-3 text-center border border-r-0">
            <p>Status</p>
            <p>
              {subscription.planName}{" "}
              <span className="px-2 py-0.5 text-[#6aa1e9] bg-[#bbdefb]">
                {subscription.status}
              </span>
            </p>
          </div>

          <div className="flex-1 p-3 text-center border border-r-0">
            <p>Start Date</p>
            <p>
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(subscription.currentPeriodStart)}
            </p>
          </div>

          <div className="flex-1 p-3 text-center border ">
            <p>Next Payment</p>
            <p>
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>
      </div>

      {subscription.latestInvoiceUrl && (
        <div className="mt-8">
          <a
            href={subscription.latestInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700"
          >
            View Invoice
          </a>
        </div>
      )}
      <div className="mt-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 mx-auto text-white bg-gray-500 hover:bg-gray-700 max-w-48"
        >
          <IoMdReturnLeft /> Return to Home
        </Link>
      </div>
    </div>
  );
}
