import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { Task } from "@/types/Task";

export function TaskCard({
    task,
    deleteTask,
    setEditingTask,
}: {
    task: Task;
    deleteTask: (id: string) => void;
    setEditingTask: (task: Task) => void;
}) {
    return (
        <Card key={task.id}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <span
                            className={`text-xs text-primary px-2 py-1 rounded-full ${
                                task.status == "To Do"
                                    ? "bg-red-500"
                                    : task.status == "In Progress"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                        >
                            {task.status}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setEditingTask(task)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteTask(task.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
