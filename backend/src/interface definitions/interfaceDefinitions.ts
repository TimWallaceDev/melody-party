export interface Rooms {
    [key: string]: Room;
}

export interface Track {
    track: {
        preview_url: string;
        name: string
    }
}

export interface Room {

    users: Users;
    tracks: Track[];
    playlistName: string;
    playlistImg: string;
    rounds: number;
    currentQuestion: number;
    correctAnswer: string;
    questionTimestamp: number;
    numberOfPlayers: number;
    playersAnswered: number;
    skips: number;
}

export interface User {
    name: string;
    score: number;
    scoreLastRound: number;
}

export interface Users {
    [key: string]: User;
}

export interface PlaylistData {
    playlistName: string;
    playlistImg: string;
    playlistTracks: Track[]
}