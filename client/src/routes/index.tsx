import ChatWindow, { Message } from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import UsersList, { User } from "@/components/UsersList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { getUsers } from "@/lib/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		const { user } = context;
		if (!user || Object.keys(user).length === 0) {
			return redirect({ to: "/register" });
		}
		return { user };
	},
	component: HomePage,
});

function HomePage() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const [activeChatUserId, setActiveChatUserId] = useState("");
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [socket, setSocket] = useState<any>(null);
	const queryclient = useQueryClient();

	useEffect(() => {
		const newSocket = io("http://localhost:3000");
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	useEffect(() => {
		if (!socket) return;

		socket.emit("addNewUser", user.userId);
		socket.on("getOnlineUsers", (res: []) => {
			console.log(res);
			setOnlineUsers(res);
		});

		return () => {
			socket.off("getOnlineUsers");
		};
	}, [socket, user]);

	const { data, isLoading, isError } = useQuery<User[], Error>({
		queryKey: ["get-users"],
		queryFn: getUsers,
	});

	const handleChatCreation = () => {
		queryclient.invalidateQueries({
			queryKey: ["get-chats", user.userId],
		});
	};

	if (isError) return <div>Error loading data</div>;

	return (
		<div className="py-4 lg:py-12 px-4">
			<div className="text-center">
				<h2 className="text-xl md:text-4xl font-semibold">Chat App</h2>
				<h4 className="">Your username is - {user.username}</h4>
				<Button
					variant={"secondary"}
					className="mt-4"
					onClick={async () => {
						await fetch("/api/auth/logout", {
							method: "GET",
						});
						navigate({ to: "/sign-in" });
						toast({ title: "Logged out" });
					}}>
					Log out
				</Button>
			</div>
			<div className="flex flex-col-reverse lg:flex-row gap-2">
				<div className="flex-grow">
					{data && isLoading ? (
						<div>Loading data</div>
					) : (
						<UsersList
							data={data}
							currentUser={user.userId}
							activeChatUserId={activeChatUserId}
							setActiveChatUserId={setActiveChatUserId}
							onlineUsers={onlineUsers}
							onChatCreated={handleChatCreation}
						/>
					)}
				</div>
				<div className="flex-grow">
					<ChatWindow
						userId={user.userId}
						activeChatUserId={activeChatUserId}
						messages={messages}
						socket={socket}
						setMessages={setMessages}
					/>
				</div>
			</div>
		</div>
	);
}
