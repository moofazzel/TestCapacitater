import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import dbConnect from "./lib/mongodb";
import { User } from "./models/user-model";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
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
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await dbConnect();

        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          // Create a new user with Google profile data
          existingUser = await User.create({
            email: profile.email,
            name: profile.name,
          });
        }
        user.id = existingUser._id.toString();
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
