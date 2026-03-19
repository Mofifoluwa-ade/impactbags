import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  // Use JWT so we don't need a database
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Forward useful fields into the JWT
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    // Expose them on the client-side session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },

  pages: {
    // Send users to our custom sign-in page instead of NextAuth's default
    signIn: "/",
    error: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
