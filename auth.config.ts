import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "developer@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This will be overridden in auth.ts because Prisma is not edge-compatible
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    trustHost: true,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.onboarded = (user as any).onboarded;
                token.role = (user as any).role;
            }
            // Note: Prisma DB checking happens in auth.ts, because it requires Node runtime
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                (session.user as any).onboarded = token.onboarded;
                (session.user as any).cityId = token.cityId;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig
