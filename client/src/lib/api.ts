import type { Message } from "@/components/ChatWindow";
import { User } from "@/components/UsersList";

export async function getUser() {
	try {
		const res = await fetch("/api/user");
		if (!res.ok) {
			throw new Error("Server error getting user");
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw new Error("Error fetching user");
	}
}

export async function getUsers(): Promise<User[]> {
	try {
		const res = await fetch("/api/users");
		if (!res.ok) {
			throw new Error("Server error getting users");
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw new Error("Error fetching users");
	}
}

export async function getChatRecipient(userId: string): Promise<User> {
	try {
		const res = await fetch(`/api/users/${userId}`);

		if (!res.ok) {
			throw new Error("Server error getting chats");
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw new Error("Error fetching users");
	}
}

export async function getChats(userId: string) {
	try {
		const res = await fetch(`/api/chats/${userId}`);

		if (!res.ok) {
			throw new Error("Server error getting chats");
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw new Error("Error fetching users");
	}
}

export async function createChat(firstId: string, secondId: string) {
	const paylod = {
		firstId: firstId,
		secondId: secondId,
	};

	try {
		const res = await fetch("/api/chats/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paylod),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error("Error creating chat");
		}
		return data;
	} catch (error) {
		throw new Error("Error creating new chat");
	}
}

export async function sendMessage({ message }: { message: Message }) {
	try {
		const res = await fetch("/api/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		});

		const data = await res.json();

		if (!res.ok) {
			let message;

			if (data?.message) {
				message = data.message;
			} else {
				message = data;
			}

			return { error: true, message };
		}

		return data;
	} catch (error) {
		throw new Error("Error sending message");
	}
}

export async function getMessages(chatId: string) {
	try {
		const res = await fetch(`/api/messages/${chatId}`);

		if (!res.ok) {
			throw new Error("Server error getting chats");
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw new Error("Error getting chat messages");
	}
}
