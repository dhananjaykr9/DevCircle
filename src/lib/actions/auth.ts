"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        if (error instanceof AuthError) {
            return { error: "Failed to automatically sign in after registration" };
        }
        return { error: "Something went wrong" };
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
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        return { error: "Something went wrong" };
    }
}

export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Don't reveal whether email exists
        return { success: true, message: "If an account with that email exists, a password reset link has been generated." };
    }

    if (!user.hashedPassword) {
        return { error: "This account uses Google or GitHub sign-in. Please use that method to log in." };
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.create({
        data: { email, token, expires },
    });

    // Build the reset URL
    const baseUrl = process.env.NEXTAUTH_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    // Try sending email via nodemailer if SMTP is configured
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: "DevCircle - Reset Your Password",
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                        <h2>Reset Your Password</h2>
                        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
                        <p style="margin-top: 16px; color: #666; font-size: 13px;">If you didn't request this, you can ignore this email.</p>
                    </div>
                `,
            });
        } catch {
            // Email send failed — still return success to avoid leaking info
        }
    }

    const emailSent = !!(process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD);
    return { success: true, resetUrl: !emailSent ? resetUrl : undefined };
}

export async function resetPassword(formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password) {
        return { error: "Missing required fields" };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!resetToken) {
        return { error: "Invalid or expired reset link" };
    }

    if (new Date() > resetToken.expires) {
        await prisma.passwordResetToken.delete({ where: { token } });
        return { error: "Reset link has expired. Please request a new one." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email: resetToken.email },
        data: { hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return { success: true };
}
