import express, { Application, Request, Response } from "express";
import { UserContoller } from "./app/modules/user/user.controller";
const app: Application = express();
// Middlewares
app.use(express.json());
// Health Route
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Service is up and running",
    database: "MongoDB is connected"
  });
});

app.post("/api/v1/auth", UserContoller.Registration)

export default app;
