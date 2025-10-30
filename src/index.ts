// src/index.ts

import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import prisma from "./utils/prisma";
import { errorMiddleware } from "./middlewares/error.middleware";
import userRouter from "./routes/user.route";
import cookieParser from "cookie-parser";
import absensiRouter from "./routes/absensi.router";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Absensi Backend is running!" });
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/absensi", absensiRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
