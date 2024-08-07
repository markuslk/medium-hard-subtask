import Chat from "../models/Chat.js";
import { Router } from "express";

const ChatRoute = Router();

ChatRoute.post("/", async (req, res) => {
	const { firstId, secondId } = req.body;

	try {
		const chat = await Chat.findOne({
			members: { $all: [firstId, secondId] },
		});

		if (chat) return res.status(200).json(chat);

		const newChat = await new Chat({
			members: [firstId, secondId],
		});

		await newChat.save();

		res.status(200).json(newChat);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

ChatRoute.get("/:userId", async (req, res) => {
	const userId = req.params.userId;

	try {
		const chats = await Chat.find({
			members: { $in: [userId] },
		});
		res.status(200).json(chats);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

ChatRoute.get("/find/:firstId/:secondId", async (req, res) => {
	const { firstId, secondId } = req.params;

	try {
		const chat = await Chat.findOne({
			members: { $all: [firstId, secondId] },
		});
		res.status(200).json(chat);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

export default ChatRoute;
