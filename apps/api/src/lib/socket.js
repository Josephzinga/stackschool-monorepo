"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer, frontendOrigin) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: frontendOrigin,
            methods: ['GET', 'POST'],
            credentials: true
        },
    });
    io.on('connection', (socket) => {
        console.log("Un utilisateur s'est connecté :", socket.id);
        socket.on('join_room', (roomName) => {
            socket.join(roomName);
            console.log(`L'utilisateur ${socket.id} a rejoint la chambre : ${roomName}`);
        });
        socket.on('disconnect', () => {
            console.log('Utilisateur déconnecté');
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io n'est pas initialisé !");
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map