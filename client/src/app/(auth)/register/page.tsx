"use client";

import { ClipboardList } from "lucide-react";
import { RegisterForm } from "@/components/auth/register/register-form";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Login() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {!isMobile && (
                <div className="flex flex-col inset-0 bg-black">
                    <div className="w-full h-full flex flex-col gap-[100px] items-center justify-center">
                        <div className="flex flex-col items-center gap-6 md:flex-row">
                            <div className="flex w-14 h-14 mr-2 items-center justify-center rounded-md bg-white">
                                <ClipboardList className="w-[2.5em] h-[2.5em] text-black" />
                            </div>
                            <h1 className="text-5xl font-bold text-white">Task Manager</h1>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <ClipboardList className="size-4" />
                        </div>
                        Task Manager
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm />
                    </div>
                </div>
                <Toaster richColors />
            </div>
        </div>
    );
}
