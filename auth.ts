import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    trustHost: true,
    session: {
        strategy: "jwt"
    },
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
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.onboarded = (user as any).onboarded;
                token.role = (user as any).role;
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
})
