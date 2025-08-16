import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app"
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config({ path: '.env.local' });
async function main() {
  try {
    await mongoose.connect(process.env.database_url as string);

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:3000', 'https://job-task-client-two.vercel.app'],
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle user disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => console.log(err));