import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import "dotenv/config";
import mongoose from "mongoose";
import Authroute from "./routes/auth.js";
import { authorization } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UsersRoute from "./routes/users.js";
import UserRoute from "./routes/user.js";
import ChatRoute from "./routes/chat.js";
import MessageRoute from "./routes/message.js";

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("mongodb with mongoose connected"))
	.catch((err) => console.log(err));
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: "http://localhost:5173" });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", Authroute);
app.use("/api/user", authorization, UserRoute);
app.use("/api/users", authorization, UsersRoute);
app.use("/api/chats", authorization, ChatRoute);
app.use("/api/messages", authorization, MessageRoute);

let onlineUsers = [];

io.on("connection", (socket) => {
	socket.on("addNewUser", (userId) => {
		if (!onlineUsers.some((user) => user.userId === userId)) {
			onlineUsers.push({
				userId,
				socketId: socket.id,
			});
		}

		io.emit("getOnlineUsers", onlineUsers);
	});

	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = onlineUsers.find((user) => user.userId === receiverId);

		if (user) {
			io.to(user.socketId).emit("getMessage", {
				senderId,
				text,
			});
		}
	});

	socket.on("typing", (chatId) => {
		socket.broadcast.to(chatId).emit("typing", socket.id);
	});

	socket.on("disconnect", () => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

		io.emit("getOnlineUsers", onlineUsers);
	});
});

server.listen(3000, () => {
	console.log("server running at http://localhost:3000");
});
