import mongoose, { Types } from "mongoose";

const stripeSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    planId: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
      enum: ["Starter", "Professional", "Enterprise"], // This ensures only these values are allowed
    },
    status: {
      type: String,
      required: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    latestInvoiceUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const StripeSubscription =
  mongoose.models.StripeSubscription ||
  mongoose.model("StripeSubscription", stripeSubscriptionSchema);

export { StripeSubscription };
