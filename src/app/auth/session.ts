"use server";
import {cache} from "react";
import {cookies} from "next/headers";
import {invalidateAllSessions, validateSessionToken} from "./api";
import {SessionValidationResult} from "./api";
import {redirect} from "next/navigation";

export const getCurrentSession = cache(
    async (): Promise<SessionValidationResult> => {
        const token = (await cookies()).get("session")?.value ?? null;
        if (token === null) {
            return {session: null, user: null};
        }
        const result = validateSessionToken(token);
        return result;
    },
);

export const logoutServer = async () => {
    const {user} = await getCurrentSession();
    if (user) {
        await invalidateAllSessions(user.id);
    }
    redirect("/auth/login");
};
