import mongoose, { Types } from "mongoose";

const teamSchema = new mongoose.Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true }, // Team owner
  members: [
    {
      userId: { type: Types.ObjectId, ref: "User" }, // Reference to user
      name: { type: String }, // Member name
      email: { type: String, required: true, unique: true }, // Ensure unique email
      token: { type: String, default: null }, // Invitation token
      tokenExpiration: { type: Date, default: null }, // Token expiration
      joined: { type: Boolean, default: false }, // Joined status
      addedAt: { type: Date, default: Date.now },
    },
  ],
  team_owner_sheet_id: {
    type: String,
    required: true,
    trim: true,
  }, // Associated Google Sheets IDs
  addedAt: { type: Date, default: Date.now },
});

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
