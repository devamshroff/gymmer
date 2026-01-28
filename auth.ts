import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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

      return true;
    },
    async session({ session, token }) {
      // Add user info to session if needed
      return session;
    },
  },
})
