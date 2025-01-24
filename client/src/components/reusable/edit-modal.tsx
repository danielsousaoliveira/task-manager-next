import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/Task";

export function EditModal({
    editingTask,
    setEditingTask,
    updateTask,
}: {
    editingTask: Task | undefined;
    setEditingTask: (task: Task | undefined) => void;
    updateTask: () => void;
}) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Input
                        placeholder="Task title"
                        value={editingTask?.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value } as Task)}
                    />
                    <Textarea
                        placeholder="Description"
                        value={editingTask?.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value } as Task)}
                    />
                    <Select
                        value={editingTask?.status}
                        onValueChange={(value) =>
                            setEditingTask({ ...editingTask, status: value as Task["status"] } as Task)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingTask(undefined)}>
                            Cancel
                        </Button>
                        <Button onClick={updateTask}>Update</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
