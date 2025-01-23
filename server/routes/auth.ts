import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Response } from "express";
import { authenticateToken } from "../authMiddleware";
import { AuthenticatedRequest } from "../models/AuthenticatedRequest";
import { isDeepStrictEqual } from "util";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed", message: error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

router.get("/users/current", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            id: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" });
    }
});

router.patch("/users/current", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { username, email, avatar } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = {
            ...(username && { username }),
            ...(email && { email }),
            ...(avatar && { avatar }),
        };

        if (isDeepStrictEqual(updatedUser, user)) {
            return res.json({ response: "No changes detected" });
        }
        user.set(updatedUser);
        await user.save();
        res.json({ response: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to get user" });
    }
});

export default router;
