import Team from "@/models/team-model";
import { User } from "@/models/user-model";

export async function checkUserAccess(email) {
  // Check if the user exists in the User model
  const user = await User.findOne({ email });
  if (user) {
    return { accessType: "direct", user };
  }

  // Check if the user exists in the Team model
  const team = await Team.findOne({ "members.email": email });
  if (team) {
    const member = team.members.find((m) => m.email === email);
    return { accessType: "team", team, member };
  }

  // No access
  return { accessType: "none" };
}
