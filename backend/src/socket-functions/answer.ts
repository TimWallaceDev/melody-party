import { getRooms } from "../server"
import { Server, Socket } from "socket.io"

export function checkAnswer(io: Server, socket: Socket, roomCode: string, answer: string, timestamp: number){
    const rooms = getRooms()
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
}