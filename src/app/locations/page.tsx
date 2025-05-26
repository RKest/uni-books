import {db} from "@/db";
import {locations} from "@/db/schema";
import Link from "next/link";

export default async function LocationsPage() {
    try {
        const locationsData = await db.select().from(locations);

        return (
            <div
                className="container  mx-auto px-4 py-12"
                style={{backgroundColor: "var(--background)", color: "var(--foreground)"}}
            >
                <h1 className="text-4xl font-bold mb-4 text-center">🌍 Our Locations</h1>

                {locationsData.length > 0 ? (
                    <>
                        <p className="text-center text-sm mb-8 text-[color:var(--foreground)] opacity-70">
                            Found {locationsData.length} location{locationsData.length > 1 ? "s" : ""}.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {locationsData.map((location) => (
                                <Link
                                    key={location.id}
                                    href={`/locations/${location.id}`}
                                    className="block group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                                    aria-label={`View details for ${location.name}`}
                                >
                                    <div
                                        className="rounded-2xl shadow-md p-6 transition-transform transform group-hover:scale-[1.02] group-hover:shadow-xl duration-300 border border-neutral-200 dark:border-neutral-800"
                                        style={{
                                            backgroundColor: "var(--background)",
                                            color: "var(--foreground)",
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">📍</span>
                                            <h2 className="text-lg font-semibold">{location.name}</h2>
                                        </div>
                                        <p className="text-sm opacity-80">{location.address}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center opacity-70">
                        No locations found. Try again later or{" "}
                        <Link
                            href="/contact"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            contact us
                        </Link>
                        .
                    </p>
                )}
            </div>
        );
    } catch (err: any) {
        return (
            <div
                className="flex justify-center items-center min-h-screen text-center px-4"
                style={{color: "red"}}
            >
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Error loading locations</h2>
                    <p>{err.message}</p>
                </div>
            </div>
        );
    }
}
