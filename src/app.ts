import express, { Application, Request, Response } from "express";
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

export default app;
