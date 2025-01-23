import axiosInstance from "./instance";
import { setToken, removeToken } from "../session/session";
import { AuthResponse } from "@/types/AuthResponse";

export const AuthApiHandler = {
    login: async function (email: string, password: string): Promise<void> {
        const response = await axiosInstance.post<AuthResponse>("/auth/login", { email, password });
        setToken(response.data.token);
    },

    register: async function (username: string, email: string, password: string): Promise<void> {
        await axiosInstance.post("/auth/register", { username, email, password });
    },

    logout: async function (): Promise<void> {
        removeToken();
    },

    getCurrentUser: async function (): Promise<any> {
        return await axiosInstance.get("auth/users/current");
    },

    updateCurrentUser: async function (username: string, email: string, avatar: string): Promise<any> {
        return await axiosInstance.patch("auth/users/current", { username, email, avatar });
    },
};
