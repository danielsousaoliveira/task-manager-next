"use server";

import { cookies } from "next/headers";

export async function setToken(token: string) {
    (await cookies()).set(process.env.TOKEN_NAME as string, token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export async function getToken(): Promise<string | undefined> {
    return (await cookies()).get("token")?.value;
}

export async function removeToken() {
    (await cookies()).delete(process.env.TOKEN_NAME as string);
}
