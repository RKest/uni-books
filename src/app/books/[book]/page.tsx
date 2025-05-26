import {db} from "@/db";
import {books, locations, inventory} from "@/db/schema";
import {eq} from "drizzle-orm";
import Link from "next/link";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ book: string }>;
}) {
    const bookId = parseInt((await params).book, 10);

    if (isNaN(bookId)) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Invalid book ID.
            </div>
        );
    }

    try {
        const bookData = await db
            .select({
                name: books.title,
                author: books.author,
            })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1)
            .execute();

        if (bookData.length === 0) {
            return (
                <div className="flex justify-center items-center min-h-screen text-red-500">
                    Book not found.
                </div>
            );
        }

        const locationsForBook = await db
            .selectDistinct({
                id: locations.id,
                name: locations.name,
                address: locations.address,
            })
            .from(locations)
            .innerJoin(inventory, eq(locations.id, inventory.locationId))
            .where(eq(inventory.bookId, bookId))
            .execute();

        return (
            <div className="container mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        {bookData[0].name}
                    </h1>
                    <p className="text-lg text-gray-600 italic">by {bookData[0].author}</p>
                </div>

                {locationsForBook.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        📕 This book is currently unavailable at any location.
                    </p>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                            Available at the following locations:
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {locationsForBook.map((loc) => (
                                <Link href={`/locations/${loc.id}`} key={loc.id}>
                                    <div
                                        className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                            📍 {loc.name}
                                        </h3>
                                        <p className="text-gray-600">{loc.address}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    } catch (err: any) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading locations: {err.message}
            </div>
        );
    }
}
