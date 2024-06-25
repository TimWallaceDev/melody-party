import { useEffect } from "react"
import "./GameAdmin.scss"
import { Socket } from "socket.io-client"

interface GameAdminProps {
    socket: Socket,
    roomCode: string,
    playlistData: { playlistImg: string; playlistName: string; } | null,
    numberOfPlayers: number,
    numberOfPlayersAnswered: number,
    answers: string[],
    setRoundOver: React.Dispatch<React.SetStateAction<boolean>>,
    roundOver: boolean,
    correctAnswer: string,
}


export function GameAdmin(props: GameAdminProps) {

    const { socket, roomCode, playlistData, numberOfPlayers, numberOfPlayersAnswered, answers, setRoundOver, roundOver, correctAnswer } = props

    useEffect(() => {
        //find the correct answer and make it green
        const buttons = document.getElementsByClassName("game-information__answer") as HTMLCollectionOf<HTMLButtonElement>
        console.log("refreshing buttons")
        console.log(roundOver, correctAnswer)

        for (let button of buttons) {
            if (button.innerText === correctAnswer) {
                button.style.backgroundColor = "green"
            }
            else {
                button.style.backgroundColor = "white"
            }
        }

    }, [roundOver, correctAnswer])

    function handleEndRound() {
        console.log("handle end round socket")
        socket.emit("end round", roomCode)
        setRoundOver(true)
    }

    if (!playlistData){
        return <h1>Fetching songs</h1>
    }

    return (
        <section className="admin-game">

            <div className="room-information">
                <img className="room-information__playlist-image" src={playlistData.playlistImg} />
                <h1 className="room-information__playlist-name">{playlistData.playlistName}</h1>
                <h2 className="room-information__room-code">Room Code: {roomCode}</h2>
            </div>

            <div className="game-information">

                <h4 className="game-information__players-answered">Players answered: {numberOfPlayersAnswered}/{numberOfPlayers}</h4>

                {answers.length > 0 &&
                    <ul className="game-information__answers">
                        <li className="game-information__answer">{answers[1]}</li>
                        <li className="game-information__answer">{answers[0]}</li>
                        <li className="game-information__answer">{answers[2]}</li>
                        <li className="game-information__answer">{answers[3]}</li>
                    </ul>
                }

                {!roundOver &&
                    <button className="game-information__button" onClick={handleEndRound}>End Round</button>
                }

            </div>
        </section>
    )
}