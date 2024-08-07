import { Toaster } from "@/components/ui/toaster";
import { getUser } from "@/lib/api";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;
		try {
			const data = await queryClient.fetchQuery({
				queryKey: ["get-user"],
				queryFn: getUser,
			});
			context.user = data;
			return { user: data };
		} catch (error) {
			context.user = null;
			return { user: null };
		}
	},
	component: RootComponent,
});

function RootComponent() {
	return (
		<div className="bg-black text-white">
			<div className="max-w-screen-xl mx-auto flex flex-col min-h-screen">
				<main className="flex-1">
					<Outlet />
					<Toaster />
				</main>
			</div>
		</div>
	);
}
