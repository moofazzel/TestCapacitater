import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },

    subscriptionId: {
      type: Types.ObjectId,
      ref: "StripeSubscription", // Reference to the Stripe subscription
      default: null,
    },
    deals_tab_name: {
      type: String,
      default: "deals", // Default value for deals tab name
      trim: true,
    },
    resources_tab_name: {
      type: String,
      default: "resources", // Default value for resources tab name
      trim: true,
    },
    google_sheet_id: {
      type: String,
      default: null, // Initially set to null until setup is complete
      trim: true,
    },
    two_factor_auth: {
      type: Boolean,
      default: false,
    },
    user_agreement: {
      type: Boolean,
      default: false,
    },
    privacy_policy: {
      type: Boolean,
      default: false,
    },
    initial_setup_complete: {
      type: Boolean,
      default: false,
    },
    google_sheets_permission: {
      type: Boolean,
      default: false,
    },
    // for accessing google sheet
    google_tokens: {
      access_token: {
        type: String,
        default: null,
      },
      refresh_token: {
        type: String,
        default: null,
      },
      scope: {
        type: String,
        default: null,
      },
      token_type: {
        type: String,
        default: null,
      },
      expiry_date: {
        type: Number,
        default: null,
      },
    },
    // Trial fields
    trialStartDate: {
      type: Date,
      default: Date.now, // Trial starts when the user is created
    },
    trialEndDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
      },
    },
    isTrialActive: {
      type: Boolean,
      default: true,
    },
    isTeamMember: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
