import { ExpressValidator, validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import redis  from "../config/redis.js";

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, role } = req.body;

    const isUserAlready = await User.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }


    const hashedPassword = await User.hashPassword(password);

    // make create the user

    const user = await createUser({
        name,
        email,
        password: hashedPassword,
        role
    })

    // console.log("useeeerrrr",user);

    // now user bn gya to token generate
    const userToken = user.generateAuthToken();


    // now return the user and token 

    res.status(201).json({ userToken, user });
}


const loginUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // now get the  info for login

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid user Details" })
    }

    const isMatch = await user.comparedPassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid user Details" })
    }
    const userToken = user.generateAuthToken();


    await redis.setEx(
        `auth:user:${userToken}`,
        60 * 60 * 24, // 24 hours
        JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    );

    res.cookie("userToken", userToken);

    res.status(200).json({ userToken, user });


}

export {
    registerUser,
    loginUser
}