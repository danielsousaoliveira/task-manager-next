import { AuthApiHandler } from "@/lib/api/auth";
import { User } from "@/types/User";

export class UserService {
    private handler: any;

    constructor(handler: any = AuthApiHandler) {
        this.handler = AuthApiHandler;
    }

    updateUser = async (userData: User) => {
        try {
            await this.handler.updateCurrentUser(userData.username, userData.email, userData.avatar);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
}
