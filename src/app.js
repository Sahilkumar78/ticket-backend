import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin:"http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"
import ticketRouter from "./routes/ticket.routes.js"
import activityRouter from "./routes/activity.routes.js"
import adminRouter from "./routes/verifyAdmin.routes.js"



app.use("/api/v1/auth", authRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/admin", adminRouter);

export {app}