import shuffle from "shuffle-array"

export function getRandomTracks(numberOfTracks: number, correctIndex: number): number[] | "not enough tracks"{
    //check that there are enough tracks
    if (numberOfTracks < 4){
        return "not enough tracks"
    }

    const randomIndices: number[] = [correctIndex]
    let randomIndex: number = Math.floor(Math.random() * numberOfTracks)

    for (let i = 0; i < 3; i++){
        while(randomIndices.includes(randomIndex)){
            randomIndex = Math.floor(Math.random() * numberOfTracks)
        }
        randomIndices.push(randomIndex)
    }

    return shuffle(randomIndices)
}