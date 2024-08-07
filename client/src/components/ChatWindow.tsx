import { useQuery } from "@tanstack/react-query";
import ChatInput from "./ChatInput";
import { getChats, getMessages } from "@/lib/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type Chat = {
	id: string;
	members: string[];
};

export type Message = {
	chatId: string;
	senderId: string;
	text: string;
};

export type ChatMembers = {
	firstId: string;
	secondId: string;
};

const ChatWindow = ({
	userId,
	activeChatUserId,
	socket,
	messages,
	setMessages,
}: {
	userId: string;
	activeChatUserId: string;
	socket: any;
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
	const {
		data: chats,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get-chats", userId],
		queryFn: async () => {
			const data = await getChats(userId);
			if (!data) {
				throw new Error("Error getting chats");
			}
			return data;
		},
	});

	const activeChat = chats?.find((chat: Chat) => {
		return chat.members.includes(userId) && chat.members.includes(activeChatUserId);
	});

	const { data: messagesData, isLoading: messagesIsLoading } = useQuery({
		queryKey: ["get-messages", activeChat?._id],
		queryFn: async () => {
			const messagesContainer = document.getElementById("messages");
			const newMessage = messagesContainer?.lastElementChild;
			newMessage?.scrollIntoView({ behavior: "smooth" });
			const messages = await getMessages(activeChat?._id);
			if (!messages) {
				throw new Error("Error getting messages");
			}

			return messages;
		},
	});

	useEffect(() => {
		if (messagesData) {
			setMessages(messagesData);
		}
	}, [messagesData, setMessages]);

	useEffect(() => {
		if (!socket) return;

		const handleIncomingMessage = (message: Message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		};

		socket.on("getMessage", handleIncomingMessage);

		return () => {
			socket.off("getMessage", handleIncomingMessage);
		};
	}, [socket, setMessages]);

	useEffect(() => {
		const messagesContainer = document.getElementById("messages");
		const newMessage = messagesContainer?.lastElementChild;
		newMessage?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = (text: string) => {
		const message: Message = {
			senderId: userId,
			chatId: activeChat._id,
			text,
		};

		socket.emit("sendMessage", {
			senderId: userId,
			receiverId: activeChatUserId,
			text,
		});

		setMessages((prevMessages) => [...prevMessages, message]);
	};

	if (isError) return <div>Error</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			{activeChat && (
				<div className="flex flex-col">
					<div className="mt-8 mb-4 rounded-lg overflow-hidden max-w-screen-full border border-gray-500 h-full flex flex-col flex-shrink-0">
						<div className="flex-grow flex-1 overflow-y-auto max-h-[700px]">
							<ul id="messages" className="space-y-0.5">
								{messagesIsLoading ? (
									<LoaderCircle className="animate-spin" />
								) : (
									messages &&
									messages?.map((message: Message, index: number) => (
										<li
											key={message.chatId + index}
											className={`py-2.5 px-2 md:text-base ${message.senderId === activeChatUserId ? "text-left bg-gray-400" : "text-right bg-blue-400"}`}>
											<p className="text-sm lg:text-base">{message.text}</p>
										</li>
									))
								)}
								<li className="h-16"></li>
							</ul>
						</div>
					</div>
					<ChatInput chatId={activeChat?._id} senderId={userId} onSendMessage={handleSendMessage} />
				</div>
			)}
		</>
	);
};
export default ChatWindow;
