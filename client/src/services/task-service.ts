import { TasksApiHandler } from "@/lib/api/tasks";
import { Task } from "@/types/Task";

export class TaskService {
    private handler: any;

    constructor(handler: any = TasksApiHandler) {
        this.handler = TasksApiHandler;
    }

    fetchTasks = async (): Promise<Task[]> => {
        try {
            const response = await this.handler.getAllTasks();
            return response as Task[];
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return [];
        }
    };

    addNewTask = async (taskData?: any) => {
        try {
            await this.handler.addNewTask(taskData);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    updateTaskById = async (taskId: string, taskData: any) => {
        try {
            await this.handler.updateTaskById(taskId, taskData);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    deleteTaskById = async (taskId: string) => {
        try {
            await this.handler.deleteTaskById(taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };
}
