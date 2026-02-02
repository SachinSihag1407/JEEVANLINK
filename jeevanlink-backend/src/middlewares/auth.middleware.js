import { User } from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import redis from "../config/redis.js";

export const authUser = async (req, res, next) => {
  // token from cookie OR header
  const userToken =
    req.cookies?.userToken || req.headers.authorization?.split(" ")[1];

  if (!userToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    //  REDIS CHECK FIRST
    const cachedUser = await redis.get(`auth:user:${userToken}`);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    const decoded = Jwt.verify(userToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔴 SAVE USER IN REDIS
    await redis.setEx(
      `auth:user:${userToken}`,
      60 * 60 * 24, // 24 hours
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
