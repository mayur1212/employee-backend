import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers/resolvers";

dotenv.config();

const app = express();

// ✅ Define allowed frontend URLs (local + production)
const allowedOrigins = [
  "http://localhost:3000",
  "https://employee-frontend1.onrender.com", // your deployed frontend
];

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

// ✅ Simple test route
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
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: process.env.NODE_ENV !== "production", // disable playground in production
      playground: process.env.NODE_ENV !== "production",
    });

    await server.start();

    // ✅ Disable Apollo’s internal CORS (we handle it via Express)
    server.applyMiddleware({ app, path: "/graphql", cors: false });

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
