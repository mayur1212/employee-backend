import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "apollo-server-express"; // ✅
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers/resolvers";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;

// Sample test route
app.get("/", (req, res) => {
  res.send("🚀 Employee Backend is running successfully!");
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();

    // Mount GraphQL endpoint
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
