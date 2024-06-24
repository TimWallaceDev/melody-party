import { rooms, io } from './server.js';
import { getRandomTracks } from './functions.js';

export function handleDisconnect() {
    console.log('user disconnected');
}

export function handleStartGame(roomCode) {
    io.to(roomCode).emit("start game", roomCode)
}

export function getUsers(rooms, roomCode) {
    //get list of names
    console.log(rooms[roomCode])
    let names = Object.keys(rooms[roomCode].users).map(key => rooms[roomCode].users[key].name)
    io.emit("player added", names)
}

export function joinRoom(roomCode, username, playlistUrl) {

}

export function nextQuestion(roomCode) {
    //check if the game is over
    const currentIndex = rooms[roomCode].currentQuestion
    const rounds = rooms[roomCode].rounds
    if (currentIndex === rounds){
        io.to(roomCode).emit("game over", rooms[roomCode].users)
        console.log("game over")

        //TODO delete obj 
        return
    }

    //update the currentQuestion 
    const nextIndex = rooms[roomCode].currentQuestion + 1
    rooms[roomCode].currentQuestion = nextIndex

    //get the next correct answer (with audio preview)
    const nextTrack = rooms[roomCode].tracks[nextIndex]

    //get 3 random answers to compliment the answer
    const tracks = rooms[roomCode].tracks
    const random = getRandomTracks(tracks, nextIndex)

    //save the correct answer
    rooms[roomCode].correctAnswer = nextTrack.track.name
    //reset number of answers
    rooms[roomCode].playersAnswered = 0
    //reset number of skips
    rooms[roomCode].skips = 0

    //start a timer

    //send next question to room
    //send the answers and previewURL
    io.to(roomCode).emit("next question", [tracks[random[0]].track.name, tracks[random[1]].track.name, tracks[random[2]].track.name, tracks[random[3]].track.name], nextTrack)
}