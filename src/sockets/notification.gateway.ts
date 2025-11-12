import { Server } from "socket.io";

let _io: Server;

export const initSocket = (httpServer: any, corsOrigin: string | string[] | undefined) => {
  _io = new Server(httpServer, {
    cors: { origin: corsOrigin || "*" }
  });

  _io.on("connection", (socket) => {
    const userId = (socket.handshake.query.userId as string) || "";
    if (userId) {
      socket.join(`user:${userId}`);
    }
    socket.on("disconnect", () => {});
  });

  return _io;
};

export const io = new Proxy({} as Server, {
  get(_t, prop) {
    if (!_io) throw new Error("Socket.io is not initialized yet");
    // @ts-ignore
    return _io[prop];
  }
});
