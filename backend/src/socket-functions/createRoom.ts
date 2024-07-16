import { Socket } from "socket.io";
import { getRooms } from "../server";
import { Rooms } from "../interface definitions/interfaceDefinitions";
import { getPlaylistTracks } from "../functions/getPlaylistTracks";
import { PlaylistData } from "../interface definitions/interfaceDefinitions";


export async function createRoom(socket: Socket, playlistUrl: string, rounds: number) {
    console.log("creating room")
    const rooms: Rooms = getRooms()
    const split: string[] = playlistUrl.split("/")
    const playlistId: string = split[split.length - 1]
    const playlistData: PlaylistData | "playlist error" = await getPlaylistTracks(playlistId)

    if (playlistData === "playlist error") {
        socket.emit("create room error", "Error getting playlist data. Are you sure that link is correct?")
        return
    }

    //generate a roomcode
    let newRoomCode: string = Math.floor(Math.random() * 999_999).toString()

    //if roomcode is taken, re-generate another one. Regenerate if roomcode is less than 6 digits
    while (rooms[newRoomCode] || parseInt(newRoomCode) <= 99_999) {
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

    //add socket to new room
    socket.join(newRoomCode);

    socket.emit("confirm room", newRoomCode)
}