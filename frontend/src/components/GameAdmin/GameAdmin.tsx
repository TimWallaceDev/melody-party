import { useEffect } from "react"
// import "./GameAdmin.scss"
import { Socket } from "socket.io-client"

interface GameAdminProps {
    socket: Socket,
    roomCode: string | undefined,
    playlistData: { playlistImg: string; playlistName: string; } | null,
    numberOfPlayers: number,
    numberOfPlayersAnswered: number,
    answers: string[],
    setRoundOver: React.Dispatch<React.SetStateAction<boolean>>,
    roundOver: boolean,
    correctAnswer: string,
    currentIndex: number,
    totalQuestions: number;
}


export function GameAdmin(props: GameAdminProps) {

    const { socket, roomCode, playlistData, numberOfPlayers, numberOfPlayersAnswered, answers, setRoundOver, roundOver, correctAnswer, currentIndex, totalQuestions } = props

    useEffect(() => {
        //find the correct answer and make it green
        const buttons = document.getElementsByClassName("game-information__answer") as HTMLCollectionOf<HTMLButtonElement>

        for (let button of buttons) {
            if (button.innerText === correctAnswer) {
                button.classList.add("bg-green-500");
            }
            else {
                button.classList.remove("bg-green-500")
            }
        }

    }, [roundOver, correctAnswer])

    function handleEndRound() {
        socket.emit("end round", roomCode)
        setRoundOver(true)
    }

    if (!playlistData || !roomCode){
        return <h1 className="text-2xl text-center">Fetching songs</h1>
    }

    return (
        <section className="admin-game flex flex-col items-center p-8">

            <div className="room-information flex flex-col items-center">
                <h1 className="room-information__playlist-name text-lg capitalize">{playlistData.playlistName}</h1>
                <img className="room-information__playlist-image mt-2" src={playlistData.playlistImg} />
                <h2 className="room-information__room-code mt-8 text-3xl">Room Code: <span className="font-bold">{roomCode.substring(0, 3)} {roomCode.substring(3, 6)}</span></h2>
            </div>

            <div className="game-information flex flex-col items-center mt-4">
                <h4>Round {currentIndex} / {totalQuestions}</h4>
                <h4 className="game-information__players-answered text-lg mt-4">Players answered: <span className="font-bold">{numberOfPlayersAnswered} / {numberOfPlayers}</span></h4>

                {answers.length > 0 &&
                    <ul className="game-information__answers flex flex-col gap-4 mt-4">
                        <li className="game-information__answer text-center bg-gray-300 text-black font-bold rounded-full py-2 px-4">{answers[0]}</li>
                        <li className="game-information__answer text-center bg-gray-300 text-black font-bold rounded-full py-2 px-4">{answers[1]}</li>
                        <li className="game-information__answer text-center bg-gray-300 text-black font-bold rounded-full py-2 px-4">{answers[2]}</li>
                        <li className="game-information__answer text-center bg-gray-300 text-black font-bold rounded-full py-2 px-4">{answers[3]}</li>
                    </ul>
                }

                {!roundOver &&
                    <button className="game-information__button bg-red-300 font-bold px-4 py-2 rounded-full mt-8 text-black w-full" onClick={handleEndRound}>End Round</button>
                }

            </div>
        </section>
    )
}