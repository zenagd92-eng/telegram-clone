const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let messages = [];
let users = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('setUser', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('userJoined', username);
        socket.emit('loadMessages', messages);
    });

    socket.on('sendMessage', (msg) => {
        const newMsg = { ...msg, id: Date.now(), time: new Date().toLocaleTimeString() };
        messages.push(newMsg);
        io.emit('newMessage', newMsg);
    });
});

server.listen(3001, () => console.log('Server on http://localhost:3001'));