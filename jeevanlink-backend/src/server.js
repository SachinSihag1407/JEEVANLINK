import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv"
import * as http from "http"
import "./jobs/emergencyTimeOut.jobs.js";


dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000;

const server = http.createServer(app)

connectDB()
    .then(() => {
        server.listen(PORT,"0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("❌ MongoDB Connection Failed, server not started...", error);
    });