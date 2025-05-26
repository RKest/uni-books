"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearchTerm = searchParams.get("searchTerm") ?? "";
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);

        if (searchTerm.trim()) {
            params.set("searchTerm", searchTerm.trim());
        } else {
            params.delete("searchTerm");
        }

        const queryString = params.toString();
        const path = window.location.pathname + (queryString ? `?${queryString}` : "");

        router.push(path);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
            />
        </form>
    );
}
