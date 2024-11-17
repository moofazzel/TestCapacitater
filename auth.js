import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./lib/mongodb";
import { User } from "./models/user-model";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // adapter: MongoDBAdapter(mongoClientPromise, {databaseName: process.env.ENVIRONMENT}),
  session: {
    strategy: "jwt",
    useSecureCookies: false,
  },
  // site: process.env.NEXTAUTH_URL,
  // secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      // secret: process.env.NEXTAUTH_SECRET,

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
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});
