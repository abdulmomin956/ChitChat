import { Server } from "socket.io";
import cors from 'cors';
const _ = require("lodash");

// Create a new instance of the CORS middleware
const corsMiddleware = cors({
    methods: ["GET", "POST"],
});

// Helper function to apply the middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    // Run the cors middleware
    await runMiddleware(req, res, corsMiddleware);

    // Check if the Socket.io server is already set up
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket",
        });

        let users = [];
        let queue = [];

        // Event handler for client connections
        io.on("connection", (socket) => {
            let isBusy = false;

            if (!_.includes(users, socket.id)) {
                users.push(socket.id);
            }
            socket.emit("yourID", socket.id);
            // console.log(users);
            io.sockets.emit("allUsers", users);

            socket.on("disconnect", () => {
                _.pull(users, socket.id);

                const userInQueue = _.find(queue, u => u.id === socket.id);

                if (userInQueue) {
                    _.remove(queue, { id: userInQueue.id });
                    isBusy = false;
                }
            });

            socket.on("leaveQueue", () => {
                const userInQueue = _.find(queue, u => u.id === socket.id);

                if (userInQueue && isBusy) {
                    isBusy = false;
                    _.remove(queue, { id: userInQueue.id });
                }
            });

            socket.on("sendMessage", (data) => {
                socket.emit("messageSent", {
                    message: data.message,
                });

                io.to(data.peerId).emit("receiveMessage", {
                    message: data.message,
                });
            });

            socket.on("findPartner", (data) => {
                viablePartner = _.find(queue, u => {
                    return u.id !== socket.id && u.onlyChat === data.onlyChat
                });

                if (!viablePartner && !isBusy) {
                    isBusy = true;
                    const userInQueue = _.find(queue, u => u.id === socket.id);
                    if (!userInQueue) {
                        queue.push({ id: socket.id, onlyChat: data.onlyChat });
                    }
                } else if (!isBusy) {
                    isBusy = true;
                    _.remove(queue, { id: viablePartner.id });

                    io.to(viablePartner.id).emit("peer", {
                        peerId: socket.id,
                        initiator: true,
                    });

                    socket.emit("peer", {
                        peerId: viablePartner.id,
                        initiator: false,
                    });
                }
            });

            socket.on("signal", (data) => {
                if (!data.peerId) {
                    return;
                }

                isBusy = false;
                io.to(data.peerId).emit("signal", {
                    signal: data.signal,
                    peerId: socket.id,
                });
            });

            // socket.on("close", (data) => {
            //   io.to(data.peerId).emit("close");
            // });
        });

        // Store the Socket.io server instance in the response object
        res.socket.server.io = io;
    }

    res.end();
}