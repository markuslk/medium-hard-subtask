import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/sign-in")({
	beforeLoad: async ({ context }) => {
		const { user } = context;
		if (user && Object.keys(user).length !== 0) {
			return redirect({ to: "/" });
		}
		return { user };
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const form = useForm({
		defaultValues: {
			username: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(value),
				});
				if (res.ok) {
					toast({
						title: "Logged in",
					});
					navigate({ to: "/" });
				}
			} catch (err) {
				toast({
					title: "Error on login",
					variant: "destructive",
				});
			}
		},
	});
	return (
		<div className="flex flex-col items-center md:justify-center min-h-screen py-4 px-2">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Sign in</CardTitle>
					<CardDescription>
						Enter your username and password below to sign in to your account.
					</CardDescription>
				</CardHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<form.Field
								name="username"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Username</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											type="text"
											required
										/>
									</>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<form.Field
								name="password"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Password</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											type="password"
											required
										/>
									</>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="grid">
						<Button type="submit" className="w-full">
							Sign in
						</Button>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/register" className="underline">
								Register
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
