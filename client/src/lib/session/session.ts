"use server";

import { cookies } from "next/headers";

const TOKEN_NAME = "token";

export async function setToken(token: string) {
    (await cookies()).set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export async function getToken(): Promise<string | undefined> {
    return (await cookies()).get(TOKEN_NAME)?.value;
}

export async function removeToken() {
    (await cookies()).delete(TOKEN_NAME);
}
