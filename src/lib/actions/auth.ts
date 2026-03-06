"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "Missing required fields" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            onboarded: false
        }
    });

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/onboarding"
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Failed to automatically sign in after registration" };
        }
        throw error;
    }

    return { success: true };
}

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Missing required fields" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/feed" // Will be intercepted by middleware if not onboarded
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
}
