import { Schema, model } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		match: [/^[a-z]{4,16}$/, "Please fill a valid username - between 4-16 characters"],
	},
	password: {
		type: String,
		required: true,
	},
});

const User = model("User", userSchema);

export default User;
