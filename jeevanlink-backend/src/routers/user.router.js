import { Router } from "express";
import { body } from "express-validator"
import { loginUser, registerUser } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.post('/register',
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body('name').isLength({ min: 3 }).withMessage("Name must be 3 letters"),
        body('password').isLength({ min: 6 }).withMessage("password must be 6 lenght")
    ], registerUser
)

userRouter.post('/login',
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body('password').isLength({ min: 6 }).withMessage("password must be 6 lenght")
    ], loginUser
)
export default userRouter