import request from "supertest";
import app from "../server";
import { connectTestDb, clearDatabase } from "./helpers";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
});

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user and return 201", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    it("should return 400 for missing username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "not-an-email",
        password: "password123",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 for short password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "short",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user and return a token", async () => {
      // Register first
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 for wrong password", async () => {
      // Register first
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });

    it("should return 401 for non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });

    it("should return 400 for missing email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        password: "password123",
      });

      expect(res.status).toBe(400);
    });
  });
});
