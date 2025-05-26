import {getCurrentSession} from "@/app/auth/session";
import {db} from "@/db";
import {locations, inventory, books} from "@/db/schema";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import BookAtLocation from "./components/bookAtLocation";
import SearchForm from "./components/searchForm";

export default async function Page({
                                       params,
                                       searchParams,
                                   }: {
    params: { location: string };
    searchParams: { searchTerm?: string };
}) {

    const locationId = +params.location;
    const searchTerm = (searchParams?.searchTerm ?? "").toLowerCase();

    const {user} = await getCurrentSession();

    if (!user) {
        redirect("/auth/login");
    }

    if (isNaN(locationId)) {
        return (
            <div className="flex justify-center items-center text-red-500">
                Invalid location ID.
            </div>
        );
    }

    try {
        const locationData = await db
            .select({
                name: locations.name,
                address: locations.address,
            })
            .from(locations)
            .where(eq(locations.id, locationId));

        if (locationData.length === 0) {
            return (
                <div className="flex justify-center items-center text-red-500">
                    Location not found.
                </div>
            );
        }


        const booksAtLocation = await db
            .selectDistinct({
                bookId: inventory.bookId,
                bookTitle: books.title,
            })
            .from(inventory)
            .innerJoin(books, eq(inventory.bookId, books.id))
            .where(eq(inventory.locationId, locationId));

        const filteredBooks = booksAtLocation.filter((book) =>
            book.bookTitle.toLowerCase().includes(searchTerm)
        );

        if (filteredBooks.length === 0) {
            return (
                <div className="container mx-auto px-4 py-6 text-red-500">
                    <SearchForm/>
                    No books match the filter criteria.
                </div>
            );
        }

        const locationName = locationData[0].name;

        return (
            <div className="container mx-auto px-4 py-6">
                <SearchForm/>
                <h2 className="text-xl font-semibold text-gray-800 mt-4">
                    {locationName}
                </h2>
                <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBooks.map((book) => (
                        <BookAtLocation
                            key={book.bookId}
                            bookId={book.bookId}
                            locationId={locationId}
                            userId={user.id}
                        />
                    ))}
                </div>
            </div>
        );
    } catch (err: any) {
        return (
            <div className="flex justify-center items-center text-red-500">
                Error loading locations: {err.message}
            </div>
        );
    }
}
