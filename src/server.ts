import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function startServer() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("Connected to MongoDB.");

        const server = app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}.`);
        });

        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection:", reason);
            server.close(() => {
                console.error("Server shutting down.");
                process.exit(1);
            });
        });

        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception:", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();
