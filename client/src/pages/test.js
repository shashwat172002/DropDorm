// Import the Socket.IO client library
import { io } from 'socket.io-client';

// Connect to your deployed Socket.IO server
const socket = io("https://drop-dorm.vercel.app/", {
    transports: ['websocket'],
    reconnection: true, // Enable reconnection attempts
    debug: true // Enable debugging logs
  });
  
  socket.on("connect_error", (err) => {
    console.log("Connection Error:", err);
  });
  