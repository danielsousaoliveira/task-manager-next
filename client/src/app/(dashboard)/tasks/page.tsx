"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { TaskService } from "@/services/task-service";
import { Task } from "@/types/Task";
import { AnimatePresence, motion } from "framer-motion";
import { TaskCard } from "@/components/reusable/task-card";
import { EditModal } from "@/components/reusable/edit-modal";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Task>({ id: "", title: "", description: "", status: "To Do" });
    const [filter, setFilter] = useState<string>("All");
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const taskService = new TaskService();

    const fetchTasks = async () => {
        const fetchedTasks = await taskService.fetchTasks();
        setTasks(fetchedTasks);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask.title) {
            await taskService.addNewTask(newTask);
            fetchTasks();
            setNewTask({ id: "", title: "", description: "", status: "To Do" });
        }
    };

    const updateTask = async () => {
        if (editingTask) {
            await taskService.updateTaskById(editingTask.id, editingTask);
            fetchTasks();
            setEditingTask(undefined);
        }
    };

    const deleteTask = async (id: string) => {
        await taskService.deleteTaskById(id);
        fetchTasks();
    };

    const filteredTasks = filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

    return (
        <AnimatePresence>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex flex-row items-center gap-2 justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground mt-2">
                        <ClipboardList className="size-4" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Task Manager</CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        key="task-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Input
                                placeholder="Task title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <Textarea
                                placeholder="Description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <Select
                                    value={newTask.status}
                                    onValueChange={(value) =>
                                        setNewTask({ ...newTask, status: value as Task["status"] })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={addTask}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Task
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-4 ml-1">
                            <h3 className="text-lg font-semibold">List</h3>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="To Do">To Do</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <motion.div
                            key="task-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 1 }}
                            className="space-y-2"
                        >
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    deleteTask={deleteTask}
                                    setEditingTask={setEditingTask}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </CardContent>
                {editingTask && (
                    <motion.div
                        key="edit-modal"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-background/80 flex items-center justify-center"
                    >
                        <EditModal editingTask={editingTask} setEditingTask={setEditingTask} updateTask={updateTask} />
                    </motion.div>
                )}
            </Card>
        </AnimatePresence>
    );
}
