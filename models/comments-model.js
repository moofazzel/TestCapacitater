import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    dealId: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000, // Limit comment length for each comment
    },
    replies: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          maxlength: 500, // Limit reply content length
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export { Comment };
