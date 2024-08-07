import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const AuthRoute = Router();

AuthRoute.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: "User registered" });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

AuthRoute.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ error: "Failed to authenticate user" });
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Failed to authenticate user" });
		}
		const token = jwt.sign({ userId: user._id }, process.env.AUTH_SECRET, {
			expiresIn: "2h",
		});
		res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax" }).status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

AuthRoute.get("/logout", async (req, res) => {
	const token = req.cookies.auth_token;
	if (!token) {
		return res.status(403).json({ message: "no token" });
	}
	try {
		res.clearCookie("auth_token").status(200).json({ message: "Logged out" });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

export default AuthRoute;

export const authorization = async (req, res, next) => {
	const token = req.cookies.auth_token;
	if (!token) {
		return res.status(403).json({ message: "no token" });
	}
	try {
		const verifiedUser = jwt.verify(token, process.env.AUTH_SECRET);
		const userDetails = await User.findById(verifiedUser.userId).select("-password");
		req.userId = verifiedUser.userId;
		req.username = userDetails.username;
		return next();
	} catch (error) {
		return res.status(403).json({ message: "error" });
	}
};
