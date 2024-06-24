import "./RoundOverAdmin.scss"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

interface RoundOverAdminProps {
socket: Socket,
roomCode: string;
scores: any
}

export function RoundOverAdmin({socket, roomCode, scores}: RoundOverAdminProps) {

    const [winners, setWinners] = useState<string[]>([])

    useEffect(() => {
        topThree()
    }, [scores])

    function handleNextQuestion() {
        socket.emit("next question", roomCode)
    }

    function topThree(){
        //get keys
        const keys = Object.keys(scores)
        //sort scores
        keys.sort((a, b) => scores[a].score > scores[b].score ? -1 : 1)

        const winnersTmp: string[] = []

        for (let i = 0; i < 3; i++){
            if (keys[i]){
                const winner = scores[keys[i]]
                winnersTmp.push(`${winner.score}  -  ${winner.name}`)
            }
        }
        setWinners(winnersTmp)
    }

    return (
        <section className="">
            <button onClick={handleNextQuestion}>Next Question!</button>

            <ol>
                <h2>winners</h2>
                {winners.map(winner => <li>{winner}</li>)}
            </ol>
        </section>
    )
}