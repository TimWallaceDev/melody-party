import { Socket } from "socket.io";
import { getRooms } from "../server";
import { Rooms } from "../interface definitions/interfaceDefinitions";
import { getPlaylistTracks } from "../functions/getPlaylistTracks";
import { PlaylistData } from "../interface definitions/interfaceDefinitions";


export async function createRoom(socket: Socket, playlistUrl: string, rounds: number) {
    const rooms: Rooms = getRooms()
    const split: string[] = playlistUrl.split("/")
    const playlistId: string = split[split.length - 1]
    const playlistData: PlaylistData | "playlist error" = await getPlaylistTracks(playlistId)

    if (playlistData === "playlist error") {
        socket.emit("error", "Error getting playlist data. Are you sure that link is correct?")
        console.log("playlist error")
        return
    }

    //generate a roomcode
    let newRoomCode: string = Math.floor(Math.random() * 999_999).toString()

    //if roomcode is taken, re-generate another one
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
        questionTimestamp: Date.now(),
        numberOfPlayers: 0,
        playersAnswered: 0,
        skips: 0
    }


    //create playlistData obj
    const playlistName: string = rooms[newRoomCode].playlistName
    const playlistImg: string = rooms[newRoomCode].playlistImg
    const somePlaylistData = { playlistImg, playlistName }

    //add socket to new room
    socket.join(newRoomCode);

    //send back the room code and data for waiting room
    socket.emit("playlist data", newRoomCode, somePlaylistData)
}