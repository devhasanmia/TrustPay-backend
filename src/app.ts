import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();
// Middlewares
app.use(express.json());
const loginLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 3, // Limit each IP to 3 requests per `windowMs`
  message: {
    status: 429,
    message: "Too many login attempts. Please try again after 10 seconds.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
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
