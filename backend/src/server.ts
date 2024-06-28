import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from "socket.io";
import cors from "cors"
import { handleDisconnect, nextQuestion } from './socketHandlers';
import { getPlaylistTracks } from './functions';

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

// app.get('/', (req, res) => {
//     res.send("backend server is running");
// });

// app.use("/api/create", createRouter)

export const rooms: any = {}

export function getRooms(): {[key: string]: any}{
    return rooms
}

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => handleDisconnect());

    socket.on("next question", (roomCode: string) => nextQuestion(roomCode))

    socket.on("get users", (roomCode: string) => {
        //get list of names
        let names: string[] = Object.keys(rooms[roomCode].users).map(key => rooms[roomCode].users[key].name)
        io.emit("player added", names)
    })

    socket.on('create room', async (playlistUrl: string, rounds: number) => {
        const split: string[] = playlistUrl.split("/")
        const playlistId: string = split[split.length - 1]
        const playlistData = await getPlaylistTracks(playlistId)

        if (playlistData === "playlist error") {
            socket.emit("error", "Error getting playlist data. Are you sure that link is correct?")
            console.log("playlist error")
            return
        }
        //generate a roomcode
        let newRoomCode: string = Math.floor(Math.random() * 999_999).toString()

        while (rooms[newRoomCode]) {
            newRoomCode = Math.floor(Math.random() * 999_999).toString()
        }

        //create room

        rooms[newRoomCode] = {
            users: {},
            tracks: playlistData.playlistTracks,
            playlistName: playlistData.playlistName,
            playlistImg: playlistData.playlistImg,
            rounds: rounds,
            currentQuestion: -1,
            correctAnswer: "",
            questionTimestamp: new Date,
            numberOfPlayers: 0,
            playersAnswered: 0,
            skips: 0
        }


        //create playlistData obj
        const playlistName = rooms[newRoomCode].playlistName
        const playlistImg = rooms[newRoomCode].playlistImg
        const somePlaylistData = { playlistImg, playlistName }
        socket.join(newRoomCode);
        console.log("room " + newRoomCode + " created")
        console.log(rooms)

        socket.emit("playlist data", newRoomCode, somePlaylistData)

    });

    socket.on("end round", (roomCode: string) => {
        console.log("end round")
        //check wether answer is correct
        const correctAnswer = rooms[roomCode].correctAnswer
        io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
    })

    socket.on('join room', async (roomCode: string, username: string) => {
        //check that room exists
        if (!rooms[roomCode]) {
            socket.emit("error", "Room code is invalid. No room found")
            return
        }

        //check that username is not taken
        if (rooms[roomCode].users[username]) {
            socket.emit("error", "username is taken")
            return
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

    socket.on('answer', (roomCode: string, answer: string, timestamp: EpochTimeStamp) => {

        //check wether answer is correct
        const correctAnswer = rooms[roomCode].correctAnswer

        //if it is, add points to the score for that user
        //calculate the time (ms)
        const startTime = rooms[roomCode].questionTimestamp
        const time = timestamp - startTime
        const minus = time * 0.0333333333
        const score = 1000 - minus

        if (answer === correctAnswer) {
            rooms[roomCode].users[socket.id].score += score
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

    socket.on('skip', (roomCode: string) => {
        //increment the number of skips
        rooms[roomCode].skips++
        //if everyone has skipped, go to the next song
        if (rooms[roomCode].skips == rooms[roomCode].numberOfPlayers) {
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