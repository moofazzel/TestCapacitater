import mongoose from "mongoose";

const DealLogSchema = new mongoose.Schema(
  {
    dealId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    resourceName: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["add", "remove", "update"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DealLog =
  mongoose.models.DealLog || mongoose.model("DealLog", DealLogSchema);

export { DealLog };
