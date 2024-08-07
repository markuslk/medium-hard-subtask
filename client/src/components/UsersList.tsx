import { createChat } from "@/lib/api";
import { Circle } from "lucide-react";

export type User = {
	_id: string;
	username: string;
};

const UsersList = ({
	data,
	activeChatUserId,
	setActiveChatUserId,
	currentUser,
	onlineUsers,
	onChatCreated,
}: {
	data: User[] | undefined;
	activeChatUserId: string;
	setActiveChatUserId: (value: string) => void;
	currentUser: string;
	onlineUsers: { userId: string; socketId: string }[];
	onChatCreated: () => void;
}) => {
	const handleUserClick = async (user: User) => {
		try {
			await createChat(currentUser, user._id);
			setActiveChatUserId(user._id);
			onChatCreated();
		} catch (error) {
			console.log(error);
			throw new Error("Error getting chats");
		}
	};

	return (
		<div className="flex flex-col md:mx-auto py-10 px-4 xl:max-w-2xl xl:min-w-80">
			<h3 className="text-xl md:text-2xl font-semibold border-b pb-1">List of users</h3>
			<ul className="my-4 space-y-2 overflow-y-auto max-h-[670px]">
				{data?.map((user) =>
					currentUser === user._id ? null : (
						<li
							onClick={() => handleUserClick(user)}
							key={user._id}
							className={`py-3 px-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-700 ${activeChatUserId === user._id ? "bg-gray-700" : "bg-gray-500"}`}>
							<Circle
								className={`size-4 ${onlineUsers.some((oUser) => oUser?.userId === user._id) ? "fill-green-500 text-green-500" : "text-red-500 fill-red-500"}`}
							/>
							<div className="text-sm">{user.username}</div>
						</li>
					)
				)}
			</ul>
		</div>
	);
};
export default UsersList;
