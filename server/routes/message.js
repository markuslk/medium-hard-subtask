import Message from "../models/Message.js";
import { Router } from "express";

const MessageRoute = Router();

MessageRoute.post("/", async (req, res) => {
	const { chatId, senderId, text } = req.body;

	const message = new Message({
		chatId,
		senderId,
		text,
	});

	try {
		await message.save();
		res.status(200).json(message);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

MessageRoute.get("/:chatId", async (req, res) => {
	const { chatId } = req.params;

	try {
		const messages = await Message.find({ chatId });

		res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

export default MessageRoute;
