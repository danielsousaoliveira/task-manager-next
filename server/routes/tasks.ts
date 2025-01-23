import express, { Request, Response } from "express";
import Tasks from "../models/Tasks";
import { authenticateToken } from "../authMiddleware";
import { encryptMessages, decryptMessages } from "../utils/encryption";
import { isDeepStrictEqual } from "util";
import { AuthenticatedRequest } from "../models/AuthenticatedRequest";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const tasks = await Tasks.find({ userId: req.user.userId });
        const decryptedTasks = tasks.map((task) => {
            const messages = decryptMessages(task.encryptedTask);
            messages.id = task._id;
            return messages;
        });

        if (decryptedTasks.length > 0) {
            res.json(decryptedTasks);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const task = await Tasks.findOne({ _id: req.params.id, userId: req.user.userId });
        if (task) {
            const decryptedTask = decryptMessages(task?.encryptedTask);
            res.json(decryptedTask);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.patch("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { title, description, status } = req.body;

        if (status && !["To Do", "In Progress", "Done"].includes(status)) {
            return res.status(500).json({ error: "Invalid Status" });
        }

        const task = await Tasks.findOne({ _id: req.params.id, userId: req.user.userId });

        if (task) {
            const decryptedTask = decryptMessages(task?.encryptedTask);

            const updatedTask = {
                ...decryptedTask,
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
            };

            const encryptedTask = encryptMessages(updatedTask);

            task.encryptedTask = encryptedTask;

            if (isDeepStrictEqual(decryptedTask, updatedTask)) {
                return res.json({ response: "No changes detected" });
            }

            await task.save();
            res.json({ response: "Task updated successfully" });
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { title, description, status } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Task is required" });
        }

        const taskReady = { title: title, description: description, status: status };

        const encryptedTask = encryptMessages(taskReady);

        const task = new Tasks({
            userId: req.user.userId,
            encryptedTask: encryptedTask,
        });
        await task.save();
        res.json({ response: "Task created successfully" });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Failed to process message" });
    }
});

router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        await Tasks.deleteOne({ _id: req.params.id, userId: req.user.userId });
        res.json({ response: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

export default router;
