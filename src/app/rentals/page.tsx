import {db} from "@/db";
import {rentals, inventory, books, locations} from "@/db/schema";
import Link from "next/link";
import {getCurrentSession} from "../auth/session";
import {redirect} from "next/navigation";
import {eq} from "drizzle-orm";
import {ReturnButton} from "@/app/locations/[location]/components/rentButton";

export default async function LocationsPage() {
    try {
        const {user} = await getCurrentSession();

        if (!user) {
            redirect("/auth/login");
        }

        const rentalData = await db
            .select()
            .from(rentals)
            .innerJoin(inventory, eq(rentals.inventoryId, inventory.id))
            .innerJoin(books, eq(inventory.bookId, books.id))
            .innerJoin(locations, eq(locations.id, inventory.locationId))
            .where(eq(rentals.userId, user.id));

        if (rentalData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">
                        You have no rentals at the moment.
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/locations"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                        >
                            Rent books at our locations
                        </Link>
                        <Link
                            href="/books"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-100 text-blue-700 font-medium hover:bg-gray-200 transition"
                        >
                            Browse all available books
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">
                    Your Rentals
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentalData.map(({rentals, books, locations}) => (
                        <div
                            key={rentals.id}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {books.title}
                                </h2>
                                <p className="text-gray-600 mb-2 italic">{books.author}</p>
                                <p className="text-sm text-gray-500">
                                    📍 Rented from:{" "}
                                    <span className="font-medium text-gray-700">
                    {locations.name}
                  </span>
                                </p>
                            </div>

                            <div className="mt-6">
                                <ReturnButton
                                    inventoryId={rentals.inventoryId}
                                    userId={user.id}
                                    locationId={locations.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (err: any) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading rentals: {err.message}
            </div>
        );
    }
}
