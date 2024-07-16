// import "./RoundOverAdmin.scss"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

interface RoundOverAdminProps {
    socket: Socket,
    roomCode: string | undefined;
    scores: any
}

export function RoundOverAdmin({ socket, roomCode, scores }: RoundOverAdminProps) {

    const [winners, setWinners] = useState<string[]>([])

    useEffect(() => {
        topThree()
    }, [scores])

    function handleNextQuestion() {
        socket.emit("next question", roomCode)
    }

    function topThree() {
        //get keys
        const keys = Object.keys(scores)
        //sort scores
        keys.sort((a, b) => scores[a].score > scores[b].score ? -1 : 1)

        const winnersTmp: string[] = []

        for (let i = 0; i < 3; i++) {
            if (keys[i]) {
                const winner = scores[keys[i]]
                winnersTmp.push(`${winner.score}  -  ${winner.name}`)
            }
        }
        setWinners(winnersTmp)
    }

    return (
        <section className="round-over flex flex-col items-center">

            <h2>Leading after this round: </h2>
            <ol className="round-over__leaders">
                {winners.map(winner => <li>{winner}</li>)}
            </ol>
            
            <button className="round-over__button bg-blue-300 font-bold px-4 py-2 rounded-full mt-4 text-black w-80" onClick={handleNextQuestion}>Next Question!</button>
        </section>
    )
}