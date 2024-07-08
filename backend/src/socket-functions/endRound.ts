import { Server } from "socket.io"
import { getRooms } from "../server"
import { Rooms } from "../interface definitions/interfaceDefinitions"


export function endRound(io: Server, roomCode: string){
    const rooms: Rooms = getRooms()
    //check wether answer is correct
    const correctAnswer: string = rooms[roomCode].correctAnswer
    io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
}