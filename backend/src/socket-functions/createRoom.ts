import { Socket } from "socket.io";
import { getRooms } from "../server";
import { Track } from "../interface definitions/interfaceDefinitions";
import { getPlaylistTracks } from "../functions/getPlaylistTracks";


export async function createRoom(socket: Socket, playlistUrl: string, rounds: number) {
    const rooms = getRooms()
    const split: string[] = playlistUrl.split("/")
    const playlistId: string = split[split.length - 1]
    const playlistData: { playlistImg: string; playlistName: string; playlistTracks: Track[] } | "playlist error" = await getPlaylistTracks(playlistId)

    if (playlistData === "playlist error") {
        socket.emit("error", "Error getting playlist data. Are you sure that link is correct?")
        console.log("playlist error")
        return
    }
    //TODO
    //check that playlist is long enough for the amount of rounds

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
        questionTimestamp: Date.now(),
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
}