// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Explicitly set CORS headers for this event
    socket.emit('response', { data: 'Hello, client!' }, {
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            // Add other headers if needed
        },
    });

    socket.on('offer', data => {
        console.log(data, 36);
        io.to('offer', data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
