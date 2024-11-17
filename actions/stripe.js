"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user-model";
import { pricingData } from "@/PricingData";
import { headers } from "next/headers";

export async function createCheckoutSession(data) {
  const ui_mode = "hosted";
  const origin = headers().get("origin") || process.env.NEXT_PUBLIC_BASE_URL;
  const priceId = data.get("priceId");

  console.log("Creating checkout session with data:", {
    origin,
    priceId,
  });

  try {
    // Authenticate user
    const userSession = await auth();
    if (!userSession || !userSession.user) {
      console.error("User not authenticated");
      // throw new Error("Unauthorized access. Please log in.");
    }

    console.log("User session authenticated:", userSession.user.email);

    // Validate pricing plan
    const selectedPlan = pricingData.find((item) => item.priceId === priceId);
    if (!selectedPlan) {
      console.error("Invalid pricing plan selected:", priceId);
      throw new Error("Invalid plan selected.");
    }

    console.log("Selected plan is valid:", selectedPlan.planName);

    // Retrieve user and ensure they exist
    const user = await User.findById(userSession.user.id);
    if (!user) {
      console.error("User not found in database:", userSession.user.id);
      // throw new Error("User not found.");
    }

    console.log("User found in database:", user.email);

    let customerId = user.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      console.log("Creating Stripe customer for user:", user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });

      customerId = customer.id;

      // Save the Stripe customer ID to the user
      user.stripeCustomerId = customerId;
      await user.save();
      console.log("Stripe customer created and saved:", customerId);
    }

    // Create Stripe checkout session
    console.log("Creating Stripe checkout session for customer:", customerId);
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      ui_mode,
    });

    console.log("Checkout session created:", checkoutSession.url);
    return {
      url: checkoutSession.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    throw new Error(
      "Unable to create checkout session. Please try again later."
    );
  }
}
