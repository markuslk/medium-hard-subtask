import { Router } from "express";

const UserRoute = Router();

UserRoute.get("/", async (req, res) => {
	try {
		const user = {
			userId: req.userId,
			username: req.username,
		};
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error });
	}
});

export default UserRoute;
