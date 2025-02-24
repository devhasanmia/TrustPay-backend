import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
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

// Route
app.use("/api/v1", router)

app.use(globalErrorHandler)

export default app;
