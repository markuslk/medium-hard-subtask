import { SendHorizonal } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "./ui/input";

const ChatInput = ({
	chatId,
	senderId,
	onSendMessage,
}: {
	chatId: string;
	senderId: string;
	onSendMessage: (value: string) => void;
}) => {
	const queryclient = useQueryClient();

	const form = useForm({
		defaultValues: {
			text: "",
		},
		onSubmit: async ({ value }) => {
			const { text } = value;
			try {
				const res = await fetch("/api/messages/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ chatId, senderId, text }),
				});
				if (res.ok) {
					onSendMessage(text);
					value.text = "";
					queryclient.invalidateQueries({
						queryKey: ["get-messages", chatId],
					});
				}
			} catch (error) {
				console.log("error sending message", error);
			}
		},
	});

	return (
		<div>
			<form
				id="chat-input"
				className="flex gap-2 justify-center px-2"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}>
				<form.Field
					name="text"
					children={(field) => (
						<>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								type="text"
								className="text-black outline-none focus-visible:ring-0 focus:ring-0 focus:ring-offset-0 h-9 flex-grow max-w-xl rounded-lg px-2"
								autoComplete="off"
								placeholder="Type a message..."
								required
							/>
						</>
					)}
				/>
				<Button variant="outline" className="h-9" size="icon" type="submit">
					<SendHorizonal className="size-5 text-gray-900" />
				</Button>
			</form>
		</div>
	);
};
export default ChatInput;
