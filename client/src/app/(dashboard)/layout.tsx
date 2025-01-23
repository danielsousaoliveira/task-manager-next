"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import BottomNav from "@/components/reusable/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className=" min-h-screen flex flex-col">
                <div className="flex-grow container mx-auto px-4 py-8">{children}</div>
                <BottomNav />
            </div>
        </ProtectedRoute>
    );
}
