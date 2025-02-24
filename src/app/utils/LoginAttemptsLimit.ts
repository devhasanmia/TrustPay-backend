import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3, 
    message: {
      status: 429,
      message: "Too many login attempts. Please try again after 1 minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });


export { loginLimiter };