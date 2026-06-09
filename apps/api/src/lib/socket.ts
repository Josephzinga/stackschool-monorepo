import { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer, frontendOrigin: string) => {
  io = new Server(httpServer, {
    cors: {
      origin: frontendOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log("Un utilisateur s'est connecté :", socket.id);

    // Rejoindre une chambre (ex: ID de l'école ou rôle)
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(
        `L'utilisateur ${socket.id} a rejoint la chambre : ${roomName}`,
      );
      console.log('Data', data);
    });

    socket.on('disconnect', () => {
      console.log('Utilisateur déconnecté');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io n'est pas initialisé !");
  }
  return io;
};
