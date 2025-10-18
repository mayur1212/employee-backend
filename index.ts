// index.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/resolvers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

// ✅ Allowed frontend URLs from .env (comma-separated)
const allowedOrigins = (process.env.FRONTEND_URL || "").split(",");

// ✅ Global CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ JSON parsing middleware
app.use(express.json());

// ✅ Test route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Employee Backend is running successfully!");
});

// ✅ Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // ✅ Apollo Server setup
    const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
    await server.start();

    // ✅ Apply Apollo middleware with same CORS config
    app.use(
      "/graphql",
      cors({ origin: allowedOrigins, credentials: true }),
      express.json(),
      expressMiddleware(server)
    );

    // ✅ Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at https://employee-backend-y5xe.onrender.com/graphql`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

startServer();
