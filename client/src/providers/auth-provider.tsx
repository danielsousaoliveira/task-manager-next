"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { AuthApiHandler } from "@/lib/api/auth";
import { setupAuthInterceptor } from "@/lib/api/interceptor";
import { User } from "@/types/User";
import { AuthContextType } from "@/types/AuthContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setupAuthInterceptor();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await AuthApiHandler.login(email, password);
            const userData = await AuthApiHandler.getCurrentUser();
            setCurrentUser(userData.data);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            await AuthApiHandler.register(username, email, password);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AuthApiHandler.logout();
        } finally {
            setCurrentUser(undefined);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            setIsLoading(true);
            const userData = await AuthApiHandler.getCurrentUser();
            if (userData) {
                setCurrentUser(userData.data);
            }
        } catch (error) {
            console.error("Failed to fetch current user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
