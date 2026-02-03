import express from "express";
import cors from "cors";
import userRouter from "./routers/user.router.js";
import emergencyRouter from "./routers/emergency.router.js";
import bloodRequestRouter from "./routers/bloodrequest.router.js";
import adminRouter from "./routers/admin.router.js";



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
app.use("/blood-requests", bloodRequestRouter);
app.use("/admin", adminRouter);

export default app;
