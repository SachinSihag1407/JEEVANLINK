import { User } from "../models/user.model.js";

export const createUser = async ({ name, email, password, role }) => {
    if (!name || !email || !password || !role) {
        console.log("All flieds are required")
    }

    const user = User.create({
        name,
        email,
        password,
        role
    })

    return user
}