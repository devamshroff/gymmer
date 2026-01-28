import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { upsertUser } from "./lib/database"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Check if user's email is in the whitelist
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(e => e.trim()) || [];

      if (!user.email) {
        return false;
      }

      if (!allowedEmails.includes(user.email)) {
        // Return URL with error for unauthorized users
        return "/login?error=AccessDenied";
      }

      // Create or update user record in our database
      try {
        await upsertUser({
          id: user.email, // Use email as ID
          email: user.email,
          name: user.name || null,
          image: user.image || null,
        });
      } catch (error) {
        console.error("Error upserting user:", error);
        // Don't block sign-in if DB fails
      }

      return true;
    },
    async jwt({ token, user }) {
      // Add user ID (email) to token on first sign in
      if (user?.email) {
        token.userId = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session for use in API routes
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
})
