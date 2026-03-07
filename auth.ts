import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt"
    },
    providers: [
        // Keep OAuth providers from config
        ...authConfig.providers.filter((p: any) => p.id !== "credentials"),
        // Add full Credentials provider with Prisma access
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "developer@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.hashedPassword) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.hashedPassword);

                if (!isPasswordValid) {
                    return null;
                }

                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            // First run the edge-compatible JWT callback
            if (authConfig.callbacks?.jwt) {
                token = await authConfig.callbacks.jwt({ token, user, trigger } as any);
            }
            // Re-read user data from DB when session is updated or on sign-in
            if (trigger === "update" || trigger === "signIn" || (token.id && !token.onboarded)) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { onboarded: true, cityId: true, role: true }
                });
                if (dbUser) {
                    token.onboarded = dbUser.onboarded;
                    token.cityId = dbUser.cityId;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Edge-compatible session callback
            if (authConfig.callbacks?.session) {
                session = await authConfig.callbacks.session({ session, token } as any);
            }
            return session;
        },
    },
})
