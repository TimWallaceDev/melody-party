import { getRooms } from "../server";
import { Socket } from "socket.io";


export function getPlaylistData(socket: Socket, roomCode: string){

    const rooms = getRooms()

    //check that room exists
    if (rooms[roomCode] === undefined){
        socket.emit("playlist data", "room does not exist")
        return
    }

    //create playlistData obj
    const playlistName: string = rooms[roomCode].playlistName
    const playlistImg: string = rooms[roomCode].playlistImg
    const somePlaylistData = { playlistImg, playlistName }

    //check that admin is added to room
    if (!socket.rooms.has(roomCode)){
        socket.join(roomCode)
    }

    socket.emit("playlist data", somePlaylistData)
}