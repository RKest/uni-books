"use client";

import {logoutServer} from "@/app/auth/session";

export default function LogoutButton() {
    const logout = async () => {
        document.cookie =
            "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await logoutServer();
    };

    return (
        <button
            onClick={logout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
        >
            Logout
        </button>
    );
}
