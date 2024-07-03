import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from "socket.io";
import cors from "cors"
import { handleDisconnect } from './socket-functions/handleDisconnect';
import { nextQuestion } from './socket-functions/nextQuestion';
import { Room, Rooms } from './interface definitions/interfaceDefinitions';
import { createRoom } from './socket-functions/createRoom';
import { endRound } from './socket-functions/endRound';
import { JoinRoom } from './socket-functions/joinRoom';
import { checkAnswer } from './socket-functions/answer';
import { skipRound } from './socket-functions/skipRound';

const app = express()
app.use(cors())
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"],
    },
    path: "/socket"
});

const PORT = 3030

export const rooms: Rooms = {}

export function getRooms(): { [key: string]: Room } {
    return rooms
}

io.on('connection', (socket: Socket) => {
    
    console.log('a user connected');

    socket.on('disconnect', () => handleDisconnect());

    socket.on("next question", (roomCode: string) => nextQuestion(roomCode))

    socket.on('create room', async (playlistUrl: string, rounds: number) => createRoom(socket, playlistUrl, rounds));

    socket.on("end round", (roomCode: string) => endRound(io, roomCode))

    socket.on('join room', async (roomCode: string, username: string) => JoinRoom(io, socket, roomCode, username));

    socket.on('answer', (roomCode: string, answer: string, timestamp: number) => checkAnswer(io, socket, roomCode, answer, timestamp))

    socket.on('skip', (roomCode: string) => skipRound(io, roomCode))

});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});