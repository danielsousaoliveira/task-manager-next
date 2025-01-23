import axiosInstance from "./instance";
import { Task } from "@/types/Task";

export const TasksApiHandler = {
    getAllTasks: async function (): Promise<Task[]> {
        const response = await axiosInstance.get("/tasks");
        return response.data as Task[];
    },

    getTaskById: async function (taskId: string): Promise<any> {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        return response.data;
    },

    addNewTask: async function (taskData: any): Promise<any> {
        const response = await axiosInstance.post("/tasks", taskData);
        return response.data;
    },

    updateTaskById: async function (taskId: string, taskData: any): Promise<any> {
        const response = await axiosInstance.patch(`/tasks/${taskId}`, taskData);
        return response.data;
    },

    deleteTaskById: async function (taskId: string): Promise<any> {
        const response = await axiosInstance.delete(`/tasks/${taskId}`);
        return response.data;
    },
};
