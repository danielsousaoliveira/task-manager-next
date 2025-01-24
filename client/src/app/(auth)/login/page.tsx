"use client";

import { ClipboardList } from "lucide-react";
import { AnimatedLoginForm } from "@/components/auth/login/animated-login-form";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { StartingButton } from "@/components/reusable/starting-button";

export default function Login() {
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleGetStarted = () => {
        setShowLogin(true);
    };
    return (
        <div className="relative min-h-svh overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-black z-10"
                initial={false}
                animate={{
                    x: showLogin ? (isMobile ? "-100%" : "-50%") : "0%",
                }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-full h-full flex flex-col gap-[100px] items-center justify-center"
                    initial={false}
                    animate={{
                        x: showLogin ? (isMobile ? "" : "25%") : "0%",
                        pointerEvents: showLogin ? "none" : "auto",
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                        <div className="flex w-14 h-14 mr-2 items-center justify-center rounded-md bg-white">
                            <ClipboardList className="w-[2.5em] h-[2.5em] text-black" />
                        </div>
                        <h1 className="text-5xl font-bold text-white">Task Manager</h1>
                    </div>

                    <StartingButton handleGetStarted={handleGetStarted} />
                </motion.div>
            </motion.div>

            <motion.div
                className="grid min-h-svh lg:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: showLogin ? 1 : 0,
                    pointerEvents: showLogin ? "auto" : "none",
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {!isMobile && <div></div>}
                <div className="flex flex-col gap-4 p-6 md:p-10 bg-background z-11">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="/login" className="flex items-center gap-2 font-medium">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <ClipboardList className="size-4" />
                            </div>
                            Task Manager
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <AnimatedLoginForm isVisible={showLogin} />
                    </div>
                </div>
            </motion.div>
            <Toaster richColors />
        </div>
    );
}
