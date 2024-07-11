import { Rooms } from "../interface definitions/interfaceDefinitions"
import { getRooms } from "../server"
import { Server, Socket } from "socket.io"

export function checkAnswer(io: Server, socket: Socket, roomCode: string, answer: string, timestamp: number) {
    const rooms: Rooms = getRooms()
    //check wether answer is correct
    const correctAnswer: string = rooms[roomCode].correctAnswer

    //if it is, add points to the score for that user


    if (answer === correctAnswer) {
        //calculate the time (ms)
        const startTime: number = rooms[roomCode].questionTimestamp
        const time: number = timestamp - startTime
        const minus: number = time * 0.0333333333
        const score: number = Math.round(1000 - minus)

        rooms[roomCode].users[socket.id].score += score
        rooms[roomCode].users[socket.id].scoreLastRound = score
    }
    else {
        rooms[roomCode].users[socket.id].scoreLastRound = 0
    }

    rooms[roomCode].playersAnswered += 1


    //check if it is the last player to answer
    if (rooms[roomCode].playersAnswered === rooms[roomCode].numberOfPlayers) {
        //send the results of the round to the room
        io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
        console.log(rooms[roomCode].users)
    }

    //send the number of players answered back to all players
    const numberOfPlayers: number = rooms[roomCode].numberOfPlayers
    const numberOfPlayersAnswered: number = rooms[roomCode].playersAnswered

    io.to(roomCode).emit("players answered", numberOfPlayersAnswered, numberOfPlayers)
}