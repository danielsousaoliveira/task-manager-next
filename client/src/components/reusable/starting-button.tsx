import { Button } from "@/components/ui/button";

export function StartingButton({ handleGetStarted }: { handleGetStarted: () => void }) {
    return (
        <div>
            <Button
                variant="outline"
                size="xlg"
                className="bg-white text-black hover:bg-slate-200"
                onClick={handleGetStarted}
            >
                <span className="text-xl font-bold">Get Started</span>
            </Button>
        </div>
    );
}
