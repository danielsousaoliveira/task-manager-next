import request from "supertest";
import app from "../server";
import { connectTestDb, clearDatabase } from "./helpers";
import Task from "../models/Tasks";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
});

async function registerAndLogin() {
  // Register a user
  await request(app).post("/api/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });

  // Login to get token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });

  return loginRes.body.token;
}

async function getFirstTaskId() {
  const task = await Task.findOne();
  if (!task) throw new Error("Task not found");
  return task._id;
}

describe("Tasks Routes", () => {
  describe("POST /api/tasks", () => {
    it("should create a task and return 200", async () => {
      const token = await registerAndLogin();

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "A test task description",
          status: "To Do",
        });

      expect(res.status).toBe(200);
      expect(res.body.response).toBe("Task created successfully");
    });

    it("should return 400 for missing title", async () => {
      const token = await registerAndLogin();

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "No title provided",
          status: "To Do",
        });

      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid status", async () => {
      const token = await registerAndLogin();

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          status: "Invalid Status",
        });

      expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Test Task",
        status: "To Do",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/tasks", () => {
    it("should list tasks and return 200", async () => {
      const token = await registerAndLogin();

      // Create a task first
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          status: "To Do",
        });

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it("should return an empty array when no tasks exist", async () => {
      const token = await registerAndLogin();

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/tasks/some-id");
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update a task and return 200", async () => {
      const token = await registerAndLogin();

      // Create a task
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Original Task",
          status: "To Do",
        });

      const taskId = await getFirstTaskId();

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Task",
          status: "Done",
        });

      expect(res.status).toBe(200);
      expect(res.body.response).toBe("Task updated successfully");
    });

    it("should return 400 for invalid status", async () => {
      const token = await registerAndLogin();

      // Create a task
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          status: "To Do",
        });

      const taskId = await getFirstTaskId();

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "Invalid Status",
        });

      expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
      const res = await request(app)
        .patch("/api/tasks/some-id")
        .send({ title: "Updated" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task and return success", async () => {
      const token = await registerAndLogin();

      // Create a task
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Task to Delete",
          status: "To Do",
        });

      const taskId = await getFirstTaskId();

      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.response).toBe("Task deleted successfully");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).delete("/api/tasks/some-id");
      expect(res.status).toBe(401);
    });
  });
});
