"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function joinCommunity(cityId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Must be logged in to join a community");

    await prisma.user.update({
        where: { id: session.user.id },
        data: { cityId }
    });

    revalidatePath("/communities");
    revalidatePath(`/communities/${cityId}`);
    redirect(`/communities/${cityId}?tab=discussions`);
}
