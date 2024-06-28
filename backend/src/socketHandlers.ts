import { io } from './server';
import { getRandomTracks } from './functions';
import { getRooms } from './server';

interface Rooms {
    [key: string]: any;
}

export function handleDisconnect() {
    console.log('user disconnected');
}

export function handleStartGame(roomCode: string) {
    io.to(roomCode).emit("start game", roomCode)
}

export function nextQuestion(roomCode: string) {
    //check if the game is over
    const rooms: Rooms = getRooms()
    const currentIndex = rooms[roomCode].currentQuestion
    const rounds = rooms[roomCode].rounds
    if (currentIndex === rounds) {
        io.to(roomCode).emit("game over", rooms[roomCode].users)

        //TODO delete room obj
        return
    }

    //update the currentQuestion 
    const nextIndex = rooms[roomCode].currentQuestion + 1
    rooms[roomCode].currentQuestion = nextIndex

    //get the next correct answer (with audio preview)
    const nextTrack = rooms[roomCode].tracks[nextIndex]
    const previewUrl: string = nextTrack.track.preview_url

    //get 3 random answers to compliment the answer
    const tracks = rooms[roomCode].tracks
    const random: number[] = getRandomTracks(tracks, nextIndex)

    //save the correct answer
    rooms[roomCode].correctAnswer = nextTrack.track.name
    //reset number of answers
    rooms[roomCode].playersAnswered = 0
    //reset number of skips
    rooms[roomCode].skips = 0

    //start a timer
    rooms[roomCode].questionTimestamp = new Date;

    //send next question to room
    //send the answers and previewURL
    io.to(roomCode).emit("next question", [tracks[random[0]].track.name, tracks[random[1]].track.name, tracks[random[2]].track.name, tracks[random[3]].track.name], previewUrl)
}