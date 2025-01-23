import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ThirdParty } from "@/components/reusable/third-party";
import { RegisterUser } from "@/types/User";

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, isLoading } = useAuth();
    const router = useRouter();

    const timeout = (delay: number) => {
        return new Promise((res) => setTimeout(res, delay));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await register(username, email, password);
            toast.success("Registration successful. Redirecting to log in...");
            await timeout(2000);
            router.push("/login");
        } catch (error) {
            toast.error("Register failed. Please try again.", { description: (error as Error).message });
        }
    };

    const validateForm = () => {
        let errors: String[] = [];

        if (!username) {
            errors.push("Name is required.");
        }

        if (!email) {
            errors.push("Email is required.");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email is invalid.");
        }

        if (!password) {
            errors.push("Password is required.");
        } else if (password.length < 6) {
            errors.push("Password must be at least 6 characters.");
        }

        if (errors.length > 0) {
            errors?.forEach((error) => {
                toast.error(error);
            });
            return false;
        } else {
            return true;
        }
    };

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Register a new account</h1>
                <p className="text-balance text-sm text-muted-foreground">Enter your email below to register</p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="username">Name</Label>
                    <Input
                        id="username"
                        type="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button disabled={isLoading} type="submit" className="w-full" onClick={handleSubmit}>
                    <div>{isLoading && <Loader2 className="animate-spin" />}</div>
                    Register
                </Button>
                <ThirdParty />
            </div>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </form>
    );
}
