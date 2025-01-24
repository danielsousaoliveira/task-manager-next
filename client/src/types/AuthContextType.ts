import { User } from "./User";

export interface AuthContextType {
    currentUser: User | undefined;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchCurrentUser: () => Promise<User | undefined>;
}
