import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This calls the backend route you just created in Step 3/5
        const res = await fetch("http://localhost:5000/api/users/login-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        // If the backend says OK, we return the user to start a session
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Redirects here if user isn't logged in
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };