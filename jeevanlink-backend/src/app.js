import express from "express";
import cors from "cors";
import userRouter from "./routers/user.router.js";
import emergencyRouter from "./routers/emergency.route.js";


const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Sachu Don !!");
});

app.use("/users",userRouter)
app.use("/emergencies",emergencyRouter)

export default app;
