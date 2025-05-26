import {db} from "@/db";
import {and, eq, count} from "drizzle-orm";
import {rentals, inventory, books} from "@/db/schema";
import {RentButton, ReturnButton} from "./rentButton";

export default async function BookAtLocation({
                                                 bookId,
                                                 locationId,
                                                 userId,
                                             }: {
    bookId: number;
    locationId: number;
    userId: number;
}) {
    try {
        const inventoryItems = await db
            .select({
                id: inventory.id,
                bookTitle: books.title,
                quantity: count(),
            })
            .from(inventory)
            .innerJoin(books, eq(inventory.bookId, books.id))
            .where(
                and(eq(inventory.bookId, bookId), eq(inventory.locationId, locationId)),
            )
            .groupBy(inventory.id);

        const totalQuantity = inventoryItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );

        let availableQuantity = totalQuantity;
        let isRentedByUser = false;

        for (const item of inventoryItems) {
            const rentedItems = await db
                .select()
                .from(rentals)
                .where(
                    and(eq(rentals.inventoryId, item.id), eq(rentals.userId, userId)),
                );

            if (rentedItems.length > 0) {
                availableQuantity -= 1;
                isRentedByUser = true;
            }
        }

        if (totalQuantity == 0) {
            return (
                <div className="flex justify-center items-center min-h-screen text-gray-500">
                    No copies available for this book at this location.
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center ">
                <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
                    <div className="text-2xl font-semibold text-gray-800 mb-2">
                        {inventoryItems[0].bookTitle}
                    </div>
                    <div className="flex justify-between mb-4">
                        <p className="text-sm text-gray-600">
                            📚 Total: <strong>{totalQuantity}</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                            ✅ Available: <strong>{availableQuantity}</strong>
                        </p>
                    </div>
                    <div className="flex justify-end">
                        {!isRentedByUser ? (
                            <RentButton
                                inventoryId={inventoryItems[0].id}
                                userId={userId}
                                locationId={locationId}
                            />
                        ) : (
                            <ReturnButton
                                inventoryId={inventoryItems[0].id}
                                userId={userId}
                                locationId={locationId}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (err: any) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading book data: {err.message}
            </div>
        );
    }
}
