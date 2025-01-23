"use client";

import { ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center h-16 gap-16">
                    <Link
                        href="/tasks"
                        className={`flex flex-col items-center ${
                            pathname === "/tasks" ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                        <ClipboardList className="h-6 w-6" />
                        <span className="text-xs">Tasks</span>
                    </Link>
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center ${
                            pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                        <User className="h-6 w-6" />
                        <span className="text-xs">Profile</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
