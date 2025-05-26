"use client";

import {useActionState} from "react";
import {loginAction} from "../actions";
import Link from "next/link";

const initialState = {
    code: 200,
    message: "",
};

const LoginPage = () => {
    const [state, action] = useActionState(loginAction, initialState);

    return (
        <form action={action}>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Email
                    </label>
                    <input
                        name="username"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {state.message && (
                    <p className="text-red-500 text-xs italic mb-4">{state.message}</p>
                )}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Login
                </button>
                <p className="text-black text-center">or</p>
                <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                    href="/auth/register"
                >
                    Create Account
                </Link>
            </div>
        </form>
    );
};

export default LoginPage;
