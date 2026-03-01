import { io } from '../server';

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté : ' + socket.id);

  socket.on('message', (rawData) => {
    const message = rawData.toString();
    console.log({ rawData }, socket.id);
  });

  socket.on('error', (err) => {
    console.error(`Error: ${err}: ${socket.request.socket.remoteAddress}`);
  });

  socket.on('close', () => {
    console.log('Socket closed');
  });
});

console.log('joseph');
