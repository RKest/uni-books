"use server";

import {db} from "@/db";
import {rentals} from "@/db/schema";
import {revalidatePath} from "next/cache";

import {and, eq} from "drizzle-orm";

export async function rentBook(_: unknown, formData: FormData) {
    const inventoryId = Number(formData.get("inventoryId"));
    const userId = Number(formData.get("userId"));
    const locationId = Number(formData.get("locationId"));
    try {
        await db.insert(rentals).values({
            inventoryId: inventoryId,
            userId: userId,
            rentalDate: new Date(),
        });

        revalidatePath(`/locations/${locationId}`);
        return {message: `Rented book with inventoryId ${inventoryId}`};
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("Error renting book:", error);
        return {message: errorMessage};
    }
}

export async function returnBook(_: unknown, formData: FormData) {
    const inventoryId = Number(formData.get("inventoryId"));
    const userId = Number(formData.get("userId"));
    const locationId = Number(formData.get("locationId"));
    try {
        await db
            .delete(rentals)
            .where(
                and(eq(rentals.inventoryId, inventoryId), eq(rentals.userId, userId)),
            );

        revalidatePath(`/locations/${locationId}`);
        return {message: `Returned book with inventoryId ${inventoryId}`};
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("Error returning book:", error);
        return {message: errorMessage};
    }
}
