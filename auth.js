import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import dbConnect from "./lib/mongodb";
import { User } from "./models/user-model";

import { cookies } from "next/headers";
import Team from "./models/team-model";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    useSecureCookies: false,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        await dbConnect();

        try {
          const foundUser = await User.findOne({ email: credentials?.email });

          if (!foundUser) {
            throw new Error("No user found");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password,
            foundUser.password
          );

          if (isValidPassword) {
            return foundUser;
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    Google,
  ],
  callbacks: {
    async signIn({ user, account, profile, req }) {
      const cookieStore = cookies();
      const teamMemberCookie = cookieStore.get("team_member_login")?.value;
      const invitationEmailCookie = cookieStore.get("invitation_email")?.value;

      if (account.provider === "google") {
        await dbConnect();

        let existingUser = await User.findOne({ email: profile.email });

        // If the login attempt is for a team member
        if (teamMemberCookie === "yes") {
          if (invitationEmailCookie !== profile.email) {
            console.error(
              "❌ Email mismatch. Not allowed to join as a team member."
            );

            // 🔹 Store error in a cookie for 5 minutes
            cookies().set("auth_error", "TEAM_MEMBER_EMAIL_MISMATCH", {
              path: "/",
              expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
            });

            throw new Error(
              "Email mismatch. Not allowed to join as a team member."
            );
          }

          // Find the team by email
          const team = await Team.findOne({
            "members.email": profile.email,
            "members.tokenExpiration": { $gte: new Date() }, // Token not expired
          });

          if (!team) {
            console.error("❌ No valid invitation found.");

            cookies().set("auth_error", "NO_VALID_INVITATION", {
              path: "/",
              expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
            });

            return "/auth/error";
          }

          // Find the specific member
          const member = team.members.find(
            (m) => m.email === profile.email && m.token
          );
          if (!member) {
            console.error("❌ Invalid or expired token.");

            cookies().set("auth_error", "EXPIRED_TEAM_MEMBER_TOKEN", {
              path: "/",
              expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
            });

            return "/auth/error";
          }

          // Check if the user already exists
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            user = await User.create({
              email: profile.email,
              name: profile.name,
              password: null,
              isTeamMember: true,
            });
          }

          // Mark the member as joined in the team
          member.joined = true;
          member.token = null; // Clear the token
          member.tokenExpiration = null; // Clear expiration
          member.name = profile.name;
          await team.save();

          // Find team owner and notify them
          const teamOwner = await User.findById(team.owner);
          try {
            await sendEmail({
              to: "savvysoftware23@gmail.com",
              subject: "Team Member Joined",
              html: `<h1>Team Member Joined</h1>
                 <p>${profile.name} has joined (${teamOwner.name}) in capacitater.</p>`,
            });
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            return {
              success: false,
              status: 500,
              message: "Failed to send the notification email.",
            };
          }
        }

        // Proceed with Google login
        if (!existingUser) {
          existingUser = await User.create({
            email: profile.email,
            name: profile.name,
          });
        }

        user.id = existingUser._id.toString();

        // 🔹 Clear all cookies if login is successful
        clearAllCookies();

        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
        token.initial_setup_complete = user.initial_setup_complete;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.initial_setup_complete = token.initial_setup_complete;
      return session;
    },

    async redirect({ url, baseUrl, session }) {
      return `${baseUrl}/setup`;
    },
  },
});

// 🔹 Function to remove all cookies
function clearAllCookies() {
  const cookieStore = cookies();
  ["auth_error", "team_member_login", "invitation_email"].forEach((cookie) => {
    cookieStore.set(cookie, "", { path: "/", expires: new Date(0) });
  });
}
