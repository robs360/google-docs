import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BASE_URL as string, {
      transports: ['websocket'], // optional: more stable connection
    });
  }
  return socket;
};
