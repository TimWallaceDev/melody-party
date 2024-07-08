
import { Server } from "socket.io"
import { getRooms } from "../server"
import { nextQuestion } from "./nextQuestion"
import { Rooms } from "../interface definitions/interfaceDefinitions"

export function skipRound(io: Server,roomCode: string){
    const rooms: Rooms = getRooms()

    //increment the number of skips
    rooms[roomCode].skips++
    //if everyone has skipped, go to the next song
    if (rooms[roomCode].skips == rooms[roomCode].numberOfPlayers) {
        nextQuestion(roomCode)
        return
    }
    //send the number of skips
    io.to(roomCode).emit("number of skips", rooms[roomCode].skips)
}