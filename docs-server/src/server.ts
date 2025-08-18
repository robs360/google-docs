import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app"
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config({ path: '.env.local' });

interface User {
  socketId: string;
  image: string;
  email: string;
}
const documentUsers: Record<string, User[]> = {};
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
      socket.on('join-document', ({ documentId, user }: { documentId: string, user: { email: string, image: string } }) => {
        socket.join(documentId);
        console.log(`${user.email} joined document ${documentId}`);

        if (!documentUsers[documentId]) {
          documentUsers[documentId] = [];
        }

        const existing = documentUsers[documentId].find(u => u.email === user.email);
        if (!existing) {
          documentUsers[documentId].push({ socketId: socket.id, image: user.image, email: user.email });
        }
        io.to(documentId).emit('document-users', documentUsers[documentId]);
      });

      socket.on('send-changes', ({ documentId, content }) => {
        console.log("sending new content ",documentId)
        socket.to(documentId).emit('receive-changes', content);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const documentId in documentUsers) {
          documentUsers[documentId] = documentUsers[documentId].filter(user => user.socketId !== socket.id);
          io.to(documentId).emit('document-users', documentUsers[documentId]);
        }
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