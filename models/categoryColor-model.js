import mongoose, { Schema, Types } from "mongoose";

const CategoryColorSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Ensures one document per user
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      bgColor: {
        type: String,
        required: true,
      },
    },
  ],
});

const CategoryColor =
  mongoose.models.CategoryColor ||
  mongoose.model("CategoryColor", CategoryColorSchema);

export default CategoryColor;
