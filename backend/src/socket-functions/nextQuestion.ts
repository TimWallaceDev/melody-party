import { io } from '../server';
import { getRandomTracks } from '../functions/getRandomTracks';
import { getRooms } from '../server';
import { Rooms, Track } from '../interface definitions/interfaceDefinitions';


export function nextQuestion(roomCode: string) {
    //check if the game is over
    const rooms: Rooms = getRooms()
    const currentIndex: number = rooms[roomCode].currentQuestion
    const rounds: number = rooms[roomCode].rounds
    if (currentIndex === rounds) {
        io.to(roomCode).emit("game over", rooms[roomCode].users)
        //TODO delete room obj
        return
    }

    //update the currentQuestion 
    const nextIndex: number = rooms[roomCode].currentQuestion + 1
    rooms[roomCode].currentQuestion = nextIndex

    //get the next correct answer (with audio preview)
    const nextTrack: Track = rooms[roomCode].tracks[nextIndex]
    const previewUrl: string = nextTrack.track.preview_url

    //get 3 random answers to compliment the answer
    const tracks: Track[] = rooms[roomCode].tracks
    const random: number[] | "not enough tracks" = getRandomTracks(tracks.length, nextIndex)

    if (random === "not enough tracks"){
        io.to(roomCode).emit("error", "Not enough tracks in the playlist")
        return
    }

    //save the correct answer
    rooms[roomCode].correctAnswer = nextTrack.track.name
    //reset number of answers
    rooms[roomCode].playersAnswered = 0
    //reset number of skips
    rooms[roomCode].skips = 0

    //start a timer
    rooms[roomCode].questionTimestamp = Date.now();

    //send next question to room
    //send the answers and previewURL
    io.to(roomCode).emit("next question", [tracks[random[0]].track.name, tracks[random[1]].track.name, tracks[random[2]].track.name, tracks[random[3]].track.name], previewUrl)
}