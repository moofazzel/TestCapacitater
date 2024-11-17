import { stripe } from "@/lib/stripe";
import { StripeSubscription } from "@/models/stripeSubscriptions-model";
import { User } from "@/models/user-model";
import { pricingData } from "@/PricingData";

// Helper function to get raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function saveSubscriptionData(userId, subscriptionData, customerId) {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return;
  }

  try {
    // Save or update subscription details
    const subscription = await StripeSubscription.findOneAndUpdate(
      { userId: user._id },
      subscriptionData,
      { upsert: true, new: true }
    );

    // Update user's subscriptionId and customerId if not already set
    if (!user.subscriptionId || !user.stripeCustomerId) {
      user.subscriptionId = subscription._id;
      user.stripeCustomerId = customerId;
      user.isTrialActive = false;
      await user.save();
    }
  } catch (error) {
    console.error("Error saving subscription data:", error);
  }
}

export async function POST(req) {
  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("No signature found", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const data = event.data.object;
    const customerId = data.customer;
    const subscriptionId = data.id;

    // Extract userId from metadata
    const userId = data.metadata?.userId;

    if (!userId) {
      console.error("User ID not found in event metadata.");
      return new Response("User ID not found in metadata", { status: 400 });
    }

    // Get the plan name from the pricing data based on price ID
    const planName = getPlanNameFromPriceId(data?.lines?.data[0]?.price.id);

    switch (event.type) {
      case "customer.subscription.created":
        await saveSubscriptionData(
          userId,
          {
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            planId: data.items?.data[0]?.price.id,
            planName: planName,
            status: data.status,
            currentPeriodStart: new Date(data.current_period_start * 1000),
            currentPeriodEnd: new Date(data.current_period_end * 1000),
            cancelAtPeriodEnd: data.cancel_at_period_end,
            canceledAt: data.canceled_at
              ? new Date(data.canceled_at * 1000)
              : null,
            latestInvoiceUrl: data.latest_invoice
              ? await getInvoiceUrl(data.latest_invoice)
              : null,
          },
          customerId
        );
        break;

      case "customer.subscription.updated":
        await saveSubscriptionData(
          userId,
          {
            stripeSubscriptionId: subscriptionId,
            status: data.status,
            currentPeriodStart: new Date(data.current_period_start * 1000),
            currentPeriodEnd: new Date(data.current_period_end * 1000),
            cancelAtPeriodEnd: data.cancel_at_period_end,
            canceledAt: data.canceled_at
              ? new Date(data.canceled_at * 1000)
              : null,
            latestInvoiceUrl: data.latest_invoice
              ? await getInvoiceUrl(data.latest_invoice)
              : null,
          },
          customerId
        );
        break;

      case "customer.subscription.deleted":
        await saveSubscriptionData(
          userId,
          {
            stripeSubscriptionId: subscriptionId,
            status: "canceled",
            canceledAt: new Date(data.canceled_at * 1000),
            currentPeriodEnd: new Date(data.canceled_at * 1000),
            latestInvoiceUrl: data.latest_invoice
              ? await getInvoiceUrl(data.latest_invoice)
              : null,
          },
          customerId
        );
        break;

      case "invoice.payment_succeeded":
        if (
          data.billing_reason === "subscription_create" ||
          data.billing_reason === "subscription_cycle"
        ) {
          await saveSubscriptionData(
            userId,
            {
              stripeSubscriptionId: data.subscription,
              stripeCustomerId: customerId,
              planId: data.lines.data[0].price.id,
              planName: planName,
              status: "active",
              currentPeriodStart: new Date(data.period_start * 1000),
              currentPeriodEnd: new Date(data.period_end * 1000),
              latestInvoiceUrl: data.latest_invoice
                ? await getInvoiceUrl(data.latest_invoice)
                : null,
            },
            customerId
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

async function getInvoiceUrl(invoiceId) {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice.hosted_invoice_url || null;
  } catch (error) {
    console.error(`Error retrieving invoice URL for ${invoiceId}:`, error);
    return null;
  }
}

function getPlanNameFromPriceId(priceId) {
  if (!priceId) return;

  const plan = pricingData.find((p) => p.priceId === priceId);
  return plan ? plan.planName : "Unknown Plan";
}

// Config for Next.js API route in the App Router
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Use 'edge' if you want to execute at the edge
