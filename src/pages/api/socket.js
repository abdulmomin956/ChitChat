import { Server } from "socket.io";
import cors from 'cors';
import dbConnect, { UserModel } from "../../../db";
import mongoose from "mongoose";
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

        const addUser = (id, socketId) => {
            const user = users.filter(u => u.id === id)
            if (user.length > 0) {
                user[0].socketId = socketId
            } else {
                users.push({ id, socketId });
            }
        };

        // Event handler for client connections
        io.on("connection", (socket) => {
            console.log('object', socket.id, socket.handshake.query.username, socket.handshake.query.id);
            let isBusy = false;

            if (!_.includes(users, socket.id)) {
                users.push(socket.id);
            }

            if (socket.handshake.query.email) {
                addUser(socket.handshake.query.id, socket.id)
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

            socket.on("sendrequest", async ({ myId, otherId }) => {
                // console.log(myId, otherId);
                try {
                    dbConnect()
                    const thisUser = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(myId) })
                    thisUser.friends.push({ id: otherId, type: 'ask' })
                    await thisUser.save()
                    const otherUser = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(otherId) })
                    otherUser.friends.push({ id: myId, type: 'req' })
                    await otherUser.save()
                } catch (err) {
                    console.log(err.message);
                }
            })

            socket.on("acceptrequest", async ({ myId, otherId }) => {
                try {
                    await dbConnect()
                    const thisUser = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(myId) })
                    thisUser.friends[thisUser.friends.indexOf(thisUser.friends.find(f => f.id === otherId))].type = 'friend'
                    thisUser.markModified('friends')
                    await thisUser.save()
                    const otherUser = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(otherId) })
                    otherUser.friends[otherUser.friends.indexOf(otherUser.friends.find(f => f.id === myId))].type = 'friend'
                    otherUser.markModified('friends')
                    await otherUser.save()
                } catch (err) {
                    console.log(err.message);
                }
            })

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