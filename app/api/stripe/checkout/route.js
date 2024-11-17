import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user-model";
import { pricingData } from "@/PricingData";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const ui_mode = "hosted";
  const origin = headers().get("origin") || process.env.NEXT_PUBLIC_BASE_URL;
  console.log("🚀 ~ origin:", origin);

  const { priceId } = await request.json();

  try {
    // Authenticate user
    const userSession = await auth();
    // if (!userSession || !userSession.user) {
    //   console.error("User not authenticated");

    //   return NextResponse.json(
    //     { error: "User not authenticated. Please log in." },
    //     { status: 401 }
    //   );
    // }

    // console.log("User session authenticated:", userSession.user.email);

    // Validate pricing plan
    // const selectedPlan = pricingData.find((item) => item.priceId === priceId);
    // if (!selectedPlan) {
    //   console.error("Invalid pricing plan selected:", priceId);
    //   return NextResponse.json(
    //     { error: "Invalid plan selected." },
    //     { status: 400 }
    //   );
    // }

    // console.log("Selected plan is valid:", selectedPlan.planName);

    // Retrieve user and ensure they exist
    const user = await User.findById(userSession.user.id);
    if (!user) {
      console.error("User not found in database:", userSession.user.id);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    console.log("User found in database:", user.email);

    let customerId = user.stripeCustomerId;

    // Validate the existing Stripe customer ID
    if (customerId) {
      try {
        // Attempt to retrieve the customer from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        console.log("🚀 ~ customer:", customer);

        if (customer.deleted) {
          console.log(
            "Customer record is deleted. Creating a new Stripe customer..."
          );
          customerId = null; // Reset customerId to trigger new customer creation
        }
      } catch (err) {
        console.error("Error retrieving Stripe customer:", err.message);
        // If customer retrieval fails, assume it's invalid and create a new one
        customerId = null;
      }
    }

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
    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    return NextResponse.json(
      { error: "Unable to create checkout session. Please try again later." },
      { status: 500 }
    );
  }
}
