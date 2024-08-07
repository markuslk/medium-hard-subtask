import { Router } from "express";
import User from "../models/User.js";

const UsersRoute = Router();

UsersRoute.get("/:userId", async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findById(userId).select("-password");
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error });
	}
});

UsersRoute.get("/", async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error });
	}
});

export default UsersRoute;
