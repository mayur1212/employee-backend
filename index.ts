import express from "express";
import type { Request, Response, NextFunction } from "express"; // ✅ type-only import
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { typeDefs } from "./schema/typeDefs.ts";
import { resolvers } from "./resolvers/resolvers.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

const allowedOrigins = [
  "http://localhost:3000",
  "https://employee-frontend1.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) =>
      !origin || allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS")),
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Employee Backend is running successfully!");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
    await server.start();

    app.use("/graphql", express.json(), expressMiddleware(server));

    app.listen(PORT, () => {
      const baseURL =
        process.env.NODE_ENV === "production"
          ? `https://employee-backend-y5xe.onrender.com/graphql`
          : `http://localhost:${PORT}/graphql`;
      console.log(`🚀 Server ready at: ${baseURL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

startServer();
