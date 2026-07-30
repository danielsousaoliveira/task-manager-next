import express, { type Response } from 'express';
import mongoose from 'mongoose';
import Tasks from '../models/Tasks';
import { authenticateToken } from '../authMiddleware';
import { encryptMessages, decryptMessages } from '../utils/encryption';
import { isDeepStrictEqual } from 'util';
import type { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { validateRequest } from '../utils/validationMiddleware';
import { taskCreateSchema, taskUpdateSchema } from '../utils/validation';

interface TaskData {
  title: string;
  description?: string;
  status?: string;
  id?: string;
}

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const tasks = await Tasks.find({ userId: req.user.userId });
    const decryptedTasks = tasks.map((task) => {
      const messages = decryptMessages<TaskData>(task.encryptedTask);
      messages.id = task._id.toString();
      return messages;
    });

    if (decryptedTasks.length > 0) {
      res.json(decryptedTasks);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await Tasks.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (task) {
      const decryptedTask = decryptMessages<TaskData>(task?.encryptedTask);
      res.json(decryptedTask);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.patch(
  '/:id',
  validateRequest(taskUpdateSchema),
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }

      const { title, description, status } = req.body;

      if (status && !['To Do', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({ error: 'Invalid Status' });
      }

      const task = await Tasks.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });

      if (task) {
        const decryptedTask = decryptMessages<TaskData>(task?.encryptedTask);

        const updatedTask = {
          ...decryptedTask,
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
        };

        const encryptedTask = encryptMessages(updatedTask);

        task.encryptedTask = encryptedTask;

        if (isDeepStrictEqual(decryptedTask, updatedTask)) {
          return res.json({ response: 'No changes detected' });
        }

        await task.save();
        res.json({ response: 'Task updated successfully' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },
);

router.post(
  '/',
  validateRequest(taskCreateSchema),
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { title, description, status } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Task is required' });
      }

      const taskReady = {
        title: title,
        description: description,
        status: status,
      };

      const encryptedTask = encryptMessages(taskReady);

      const task = new Tasks({
        userId: req.user.userId,
        encryptedTask: encryptedTask,
      });
      await task.save();
      res.json({ response: 'Task created successfully' });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },
);

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const result = await Tasks.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ response: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
