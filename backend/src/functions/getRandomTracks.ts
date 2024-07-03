import shuffle from "shuffle-array"
import { Track } from "../interface definitions/interfaceDefinitions"

export function getRandomTracks(tracks: Track[], correctIndex: number): number[] | "not enough tracks"{
    //check that there are enough tracks
    if (tracks.length < 4){
        return "not enough tracks"
    }
    const length = tracks.length
    const randomIndices = [correctIndex]
    let randomIndex = Math.floor(Math.random() * length)

    for (let i = 0; i < 3; i++){
        while(randomIndices.includes(randomIndex)){
            randomIndex = Math.floor(Math.random() * length)
        }
        randomIndices.push(randomIndex)
    }

    return shuffle(randomIndices)
}