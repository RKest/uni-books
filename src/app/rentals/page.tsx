import { db } from "@/db"; // Adjust the import path to your db connection
import { rentals, inventory, books, locations } from "@/db/schema"; // Import necessary tables
import Link from "next/link";
import { getCurrentSession } from "../auth/session";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ReturnButton } from "@/app/locations/[location]/components/rentButton";

export default async function LocationsPage() {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      redirect("/auth/login");
    }

    let rentalData = await db
      .select()
      .from(rentals)
      .innerJoin(inventory, eq(rentals.inventoryId, inventory.id))
      .innerJoin(books, eq(inventory.bookId, books.id))
      .innerJoin(locations, eq(locations.id, inventory.locationId))
      .where(eq(rentals.userId, user.id));

    if (rentalData.length === 0) {
      return (
        <div className="flex justify-center align-center min-h-screen">
          <div className="flex flex-col justify-center align-center gap-2 h-100">
            <span className="text-center">You have no rentals.</span>
            <br />
            <div className="flex flex-row gap-2">
              <Link
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                href="/locations"
              >
                Rent some books at one of our locations.
              </Link>
              <Link
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                href="/books"
              >
                Browse our entire book collection.
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your rentals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalData.map(({ rentals, books, locations }) => (
            <div key={rentals.id} className="flex justify-center align-middle">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-xl font-semibold">
                  {books.title}
                </h2>
                <p className="text-gray-700 mt-1">{books.author}</p>
                <p className="text-gray-600 text-sm mt-2">
                  Rented from: {locations.name}
                </p>
              </div>
              <div className="py-10">
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
        Error loading locations: {err.message}
      </div>
    );
  }
}
