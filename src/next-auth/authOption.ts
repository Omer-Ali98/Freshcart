import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { encode } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

interface RouteToken {
  id: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    encode: (params) =>
      encode({
        ...params,
        maxAge: params.token?.remember ? 30 * 86400 : 86400,
      }),
  },
  providers: [
    Credentials({
      name: "FreshCart Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "text" },
      },
      async authorize(credentials) {
        const response = await fetch(
          "https://ecommerce.routemisr.com/api/v1/auth/signin",
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );

        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.message || "Invalid email or password");

        const tokenData = jwtDecode<RouteToken>(payload.token);

        return {
          id: tokenData.id,
          name: payload.user.name,
          email: payload.user.email,
          phone: payload.user.phone,
          token: payload.token,
          remember: credentials?.remember === "true",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        if (typeof session.user.name === "string")
          token.name = session.user.name;
        if (typeof session.user.email === "string")
          token.email = session.user.email;
        if (typeof session.user.phone === "string")
          token.phone = session.user.phone;
      }
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.phone = user.phone;
        token.remember = user.remember;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
