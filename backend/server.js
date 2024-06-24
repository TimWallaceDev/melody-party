import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import cors from "cors"
import { createRouter } from "./routes/create-router.js"
import { handleDisconnect, nextQuestion } from './socketHandlers.js';
import { getPlaylistTracks, getToken, getRandomTracks } from './functions.js';

const app = express()
app.use(cors())
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"]
    }
});

const PORT = 3030

app.get('/', (req, res) => {
    res.send("backend server is running");
});

app.use("/api/create", createRouter)

export const rooms = {}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => handleDisconnect());

    socket.on("next question", (roomCode) => nextQuestion(roomCode))

    socket.on("get users", (roomCode) => {
        //get list of names
        let names = Object.keys(rooms[roomCode].users).map(key => rooms[roomCode].users[key].name)
        io.emit("player added", names)
    })

    socket.on('create room', async (roomCode, username, playlistUrl, rounds) => {
        console.log("creating room")
        const split = playlistUrl.split("/")
        const playlistId = split[split.length - 1]
        const playlistData = await getPlaylistTracks(playlistId)

        //create room
        //check that room exists
        if (!rooms[roomCode]) rooms[roomCode] = {
            users: {},
            token: getToken(),
            tracks: playlistData.playlistTracks,
            playlistName: playlistData.playlistName,
            playlistImg: playlistData.playlistImg,
            rounds: rounds,
            currentQuestion: -1,
            correctAnswer: "",
            numberOfPlayers: 0,
            playersAnswered: 0,
            skips: 0
        }

        //create playlistData obj
        const playlistName = rooms[roomCode].playlistName
        const playlistImg = rooms[roomCode].playlistImg
        const somePlaylistData = { playlistImg, playlistName }
        socket.join(roomCode);

        socket.emit("playlist data", somePlaylistData)

    });

    socket.on("end round", (roomCode) => {
        //check wether answer is correct
        const correctAnswer = rooms[roomCode].correctAnswer
        io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
    })

    socket.on('join room', async (roomCode, username) => {
        //check that room exists

        //check that username is not taken
        if (rooms[roomCode].users[username]) {
            socket.emit("error", "username is taken")
        }
        else {
            //add user to room
            rooms[roomCode].users[socket.id] = { name: username, score: 0 }
            rooms[roomCode].numberOfPlayers += 1
        }
        //broadcast that user is in the room
        socket.join(roomCode);

        //create playlistData obj
        const playlistName = rooms[roomCode].playlistName
        const playlistImg = rooms[roomCode].playlistImg
        const playlistData = { playlistImg, playlistName }

        //get list of names
        let names = Object.keys(rooms[roomCode].users).map(key => rooms[roomCode].users[key].name)

        //send players and playlist information
        io.to(roomCode).emit("player added", names, playlistData)
    });

    socket.on('answer', (roomCode, answer, timestamp) => {

        //check wether answer is correct
        const correctAnswer = rooms[roomCode].correctAnswer

        //if it is, add points to the score for that user

        if (answer === correctAnswer) {
            rooms[roomCode].users[socket.id].score++
        }
        rooms[roomCode].playersAnswered += 1


        //check if it is the last player to answer
        if (rooms[roomCode].playersAnswered === rooms[roomCode].numberOfPlayers) {
            //send the results of the round to the room
            io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
        }

        //send the number of players answered back to all players
        const numberOfPlayers = rooms[roomCode].numberOfPlayers
        const numberOfPlayersAnswered = rooms[roomCode].playersAnswered

        io.to(roomCode).emit("players answered", numberOfPlayersAnswered, numberOfPlayers)

    })

    socket.on('skip', (roomCode) => {
        //increment the number of skips
        rooms[roomCode].skips++
        //if everyone has skipped, go to the next song
        if (rooms[roomCode].skips == rooms[roomCode].numberOfPlayers){
            nextQuestion(roomCode)
            return
        }
        //send the number of skips
        io.to(roomCode).emit("number of skips", rooms[roomCode].skips)
    })


});

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});