import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

// config
const port = process.env.PORT || 3000;
// const ip = process.env.IP || 'localhost';
const ip = process.env.IP || '192.168.1.187';


// Server
const app = express();
app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server);

// serve public dir
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// returns id from headers
async function computeUserIdFromHeaders(headers) {
  return headers.id
}



// main
io.on('connection', async (socket) => {
  
  // connection
  console.log(`Client (${socket.id }) is now connected`);
  
  // send back id to user only
  const userId = await computeUserIdFromHeaders(socket);
  socket.join(userId);
  io.to(userId).emit("welcome", userId);
  
  // message
  socket.on('card change', (msg) => {
    console.log("Message : changement de carte !");
    console.log(msg);
    io.emit('card change', msg);
  });

});



// server.listen(3000, () => {
server.listen(port, ip, function () {
  console.log(`Server is running at http://${ip}:${port}`);
});
