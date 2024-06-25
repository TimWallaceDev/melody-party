import "./GameOverAdmin.scss"
import { useEffect, useState } from "react"

export function GameOverAdmin({ scores }: any) {


    console.log("game over admin")

    useEffect(() => {
        console.log(scores)
        //get keys
        const keys: string[] = Object.keys(scores)
        //add each score to array
        const scoresArr: { name: string, score: number }[] = []
        for (let key of keys) {
            scoresArr.push(scores[key])
        }
        //sort scores
        scoresArr.sort((a, b) => a.score - b.score)
        setFinalScores(scoresArr)
        //display the scores
    }, [])

    const [finalScores, setFinalScores] = useState<any>([])


    return (
        <section className="game-over-admin">
            <h1>Game Over</h1>

            <h2>Rankings</h2>
            <ol>
                {finalScores.map(score => <li>{score.name}</li>)}
            </ol>
        </section>
    )
}