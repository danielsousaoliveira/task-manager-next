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

export default function ProfilePage() {
    const [user, setUser] = useState<User | undefined>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User>(user ?? { id: "", username: "", email: "", avatar: "" });
    const userService = new UserService();

    const { logout, currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
            setEditedUser(currentUser);
        }
    }, [currentUser]);

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
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={user?.avatar} alt={user?.username} />
                                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            {isEditing ? (
                                <motion.form
                                    key="edit-form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4 w-full"
                                >
                                    <div>
                                        <Label htmlFor="avatar">Avatar Url</Label>
                                        <Input
                                            id="avatar"
                                            value={editedUser?.avatar}
                                            onChange={(e) => setEditedUser({ ...editedUser, avatar: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={editedUser.username}
                                            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={editedUser.email}
                                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Save</Button>
                                    </div>
                                </motion.form>
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
