import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const ui_mode = "hosted";
  const origin = headers().get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

  const { priceId, userId } = await request.json();

  try {
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      ui_mode,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    return NextResponse.json(
      { error: "Unable to create checkout session. Please try again later." },
      { status: 500 }
    );
  }
}
