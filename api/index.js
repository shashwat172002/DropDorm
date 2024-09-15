import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import senderRoutes from "./routes/sender.route.js";
import receiverRoutes from "./routes/receiver.route.js";
import otpRoutes from "./routes/otp.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import yourOrdersRoutes from "./routes/yourOrders.route.js";
import senderendRoutes from "./routes/senderEnd.route.js";
import ratingRoutes from "./routes/rating.route.js";
import { Server } from "socket.io";
import cors from "cors";
import Receiver from "./models/receiver.model.js";
import Sender from "./models/sender.model.js";
import SenderEnd1 from "./models/senderEnd1.model.js";
import path from 'path';
import { createServer } from "http";
import { setupNodeErrorHandling } from 'debugsensei';
setupNodeErrorHandling();

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: "https://dormdrop.vercel.app",
  methods: ['GET', 'POST'],
}));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://dormdrop.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("Verified", (data) => {
    console.log("Received message:", data);
    socket.broadcast.emit("sendMessageToClient2", data.message);
    console.log("Sent message to Client 2");
  });

  socket.on("picked", (data) => {
    console.log("Received message:", data);
    socket.broadcast.emit("sendMessageToRec1_5", data.message);
    console.log("Sent message to sendMessageToRec1_5");
  });

  socket.on("receiverFormSubmitted", (data) => {
    console.log("Received message:", data);
    socket.broadcast.emit("sendMessageToReceiverPost", data.message);
    console.log("Sent message to sendMessageToReceiverPost");
  });

  socket.on("deleteInProcessReceiver", async (registrationNumber) => {
    try {
      const receiver = await Receiver.findOneAndDelete({ registrationNumber });
      if (!receiver) {
        console.log(`Receiver with registration number ${registrationNumber} not found.`);
        return;
      }
      console.log(`Receiver with registration number ${registrationNumber} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting receiver:", error.message);
    }
  });

  socket.on("deleteInProcessSender", async (senderRegistrationNumber) => {
    try {
      const sender = await Sender.findOneAndDelete({ registrationNumber: senderRegistrationNumber });
      if (!sender) {
        console.log(`Sender with registration number ${senderRegistrationNumber} not found.`);
        return;
      }
      console.log(`Sender with registration number ${senderRegistrationNumber} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting sender:", error.message);
    }
  });

  socket.on("deleteSenderend1model", async (senderEndModelId) => {
    try {
      const Senderend1 = await SenderEnd1.findOneAndDelete(senderEndModelId);
      if (!Senderend1) {
        console.log(`Senderend1 with ID ${senderEndModelId} not found.`);
        return;
      }
      console.log(`Senderend1 with ID ${senderEndModelId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting senderEnd1:", error.message);
    }
  });
});

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api/sender", senderRoutes);
app.use("/api/receiver", receiverRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/yourorders", yourOrdersRoutes);
app.use("/api/senderend", senderendRoutes);
app.use("/api/rating", ratingRoutes);

// Middleware for serving static files and handling errors
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 503;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
