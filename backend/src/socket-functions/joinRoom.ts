import { Server, Socket } from "socket.io"
import { getRooms } from "../server"

export function JoinRoom(io: Server, socket: Socket, roomCode: string, username: string){

    const rooms = getRooms()

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
    rooms[roomCode].users[socket.id] = { name: username, score: 0, scoreLastRound: 0 }
    rooms[roomCode].numberOfPlayers += 1
}

//broadcast that user is in the room
socket.join(roomCode);

//create playlistData obj
const playlistName: string = rooms[roomCode].playlistName
const playlistImg: string = rooms[roomCode].playlistImg
const playlistData = { playlistImg, playlistName }

//get list of names
const names: string[] = Object.keys(rooms[roomCode].users).map(key => rooms[roomCode].users[key].name)

//send players and playlist information
io.to(roomCode).emit("player added", names, playlistData)
io.to(roomCode).emit("confirm join", roomCode)
}