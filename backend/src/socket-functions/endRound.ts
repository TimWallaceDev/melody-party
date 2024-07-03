import { Server } from "socket.io"
import { getRooms } from "../server"


export function endRound(io: Server, roomCode: string){
    const rooms = getRooms()
    console.log("end round")
    //check wether answer is correct
    const correctAnswer = rooms[roomCode].correctAnswer
    io.to(roomCode).emit("results", correctAnswer, rooms[roomCode].users)
}