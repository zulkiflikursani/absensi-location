import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      type: "credentials",
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          const data = await res.json();
          if (!res.ok) {
            return null;
          }
          console.error("Login failed:", data.message); // Log error from api
          // console.log("user :", data);
          return data.data;
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    },
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Merge user object into the token if available
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any; // Pass the token data to the session
      console.log("session:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirection to the base URL plus a relative path
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return baseUrl + url;
      }
      return baseUrl + "/home"; // Default redirection
    },
  },
};

export default authOptions;
