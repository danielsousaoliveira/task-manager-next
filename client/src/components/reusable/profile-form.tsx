import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/User";

export function ProfileForm({
    handleSubmit,
    editedUser,
    setEditedUser,
    setIsEditing,
}: {
    handleSubmit: (e: React.FormEvent) => void;
    editedUser: User;
    setEditedUser: React.Dispatch<React.SetStateAction<User>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
        </form>
    );
}
