"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { AnimatePresence, motion } from "framer-motion";
import { UserService } from "@/services/user-service";
import { ProfileForm } from "@/components/reusable/profile-form";

export default function ProfilePage() {
    const [user, setUser] = useState<User | undefined>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User>(user ?? { id: "", username: "", email: "", avatar: "" });
    const userService = new UserService();

    const { logout, currentUser, fetchCurrentUser } = useAuth();
    const router = useRouter();

    const getCurrentUser = async () => {
        try {
            const userData = await fetchCurrentUser();
            if (userData) {
                setUser(userData);
            }
        } catch (error) {
            console.error("Failed to fetch current user:", error);
        }
    };

    useEffect(() => {
        getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setEditedUser(currentUser);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedUser) {
            userService.updateUser(editedUser);
            setUser(editedUser);
            setIsEditing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            toast.error("Logout failed. Please try again.", { description: (error as Error).message });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <AnimatePresence>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <motion.div
                                key="avatar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user?.avatar} alt={user?.username} />
                                    <AvatarFallback delayMs={5000}>{user?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </motion.div>

                            {isEditing ? (
                                <motion.div
                                    key="edit-form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    <ProfileForm
                                        handleSubmit={handleSubmit}
                                        editedUser={editedUser}
                                        setEditedUser={setEditedUser}
                                        setIsEditing={setIsEditing}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="profile-view"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center"
                                >
                                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                                        Edit Profile
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <motion.div
                    key="logout-button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                        Logout
                    </Button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
