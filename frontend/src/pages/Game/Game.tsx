import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import "./Game.scss"
import { Socket } from "socket.io-client";

interface GameProps {
    socket: Socket
}

export function Game(props: GameProps) {

    const {socket} = props

    const { roomCode } = useParams()
    const [gameIsStarted, setGameIsStarted] = useState(false)
    const [roundOver, setRoundOver] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [answers, setAnswers] = useState<Array<string>>([])
    const [playlistData, setPlaylistData] = useState<{playlistImg: string, playlistName: string} | null>(null)
    const [previewUrl, setPreviewUrl] = useState("")
    const [selectedButton, setSelectedButton] = useState<HTMLButtonElement | null>(null)
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState("0")
    const [scoreForLastRound, setScoreForLastRound] = useState<number | null>(null)
    const [numberOfPlayersAnswered, setNumberOfPlayersAnswered] = useState(0)
    const [numberOfPlayers, setNumberOfPlayers] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [skips, setSkips] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [totalNumberOfQuestions, setTotalNumberOfQuestions] = useState(0)
    const username = sessionStorage.getItem("username")

    useEffect(() => {
        socket.on('error', (message: string) => {
            alert(message); 
        });

        socket.on("playlist data", (somePlaylistData) => {
            setPlaylistData(somePlaylistData)
        })

        //next Question
        socket.on("next question", (answers: string[], newPreviewUrl: string, updatedNumberOfPlayers: number, updatedQuestionIndex: number, updatedNumberOfQuestions: number) => {
            setAnswers(answers)
            setGameIsStarted(true)
            setPreviewUrl(newPreviewUrl)
            setNumberOfPlayers(updatedNumberOfPlayers)
            setNumberOfPlayersAnswered(0)
            setRoundOver(false)
            setSkips(0)
            setAnswer("")
            setCurrentQuestionIndex(updatedQuestionIndex)
            setTotalNumberOfQuestions(updatedNumberOfQuestions)
            //remove button styling
            if (selectedButton){
                selectedButton.style.backgroundColor = "#ddd"
            }
            setDisabled(false)
        })

        socket.on("players answered", (newNumberOfPlayersAnswered: number, newNumberOfPlayers: number) => {
            setNumberOfPlayersAnswered(newNumberOfPlayersAnswered)
            setNumberOfPlayers(newNumberOfPlayers)
        })

        socket.on("number of skips", (newNumberOfSkips: number) => {
            setSkips(newNumberOfSkips)
        })

        socket.on("results", (correctAnswer: string, users: any) => {
            //visually display wether answer is correct
            let currentAnswer = answer
            if (currentAnswer === correctAnswer && selectedButton) {
                selectedButton.style.backgroundColor = "green"
            }
            else {
                if (answer && selectedButton) {
                    selectedButton.style.backgroundColor = "red"
                    //set the correct answer green
                }
            }
            const index: string = socket.id as string
            //set user score
            setScore(users[index].score)
            setScoreForLastRound(users[index].scoreLastRound)
            //set round over
            setRoundOver(true)

        });

        socket.on("game over", (users: any) => {
            setGameOver(true)
        })

        //get playlist data
        socket.emit("get playlist data", roomCode)

        return () => {
            socket.off('error');
            socket.off('next question');
            socket.off('player added');
            socket.off('players answered');
            socket.off('number of skips');
            socket.off('results');
            socket.off('game over');
        };
    }, [answer]);


    function handleSubmitAnswer(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let selected = e.currentTarget.innerText
        setAnswer(selected)
        setSelectedButton(e.currentTarget)
        setDisabled(true)

        e.currentTarget.classList.add("bg-blue-300")

        //send answer to server
        socket.emit("answer", roomCode, selected, Date.now())
    }

    function handleSkip(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //send skip vote to server
        socket.emit("skip", roomCode)

        e.currentTarget.disabled = true;
    }

    return (

        <main className="game flex flex-col p-16 items-center">
            {/* always available information */}
            <section className="game__information flex flex-col items-center">

                <h2 className="text-lg capitalize">{playlistData?.playlistName ? playlistData.playlistName : "loading"}</h2>
                <img className="game__image mt-2" src={playlistData?.playlistImg ? playlistData.playlistImg : ""} alt="playlist art" />

            </section>

            {/* waiting room */}
            {!gameIsStarted && username &&
                <section className="game__waiting-room flex flex-col items-center">
                    <h1 className="mt-8 text-3xl font-bold">Welcome to the game, <span className="capitalize">{username}</span></h1>
                    <p className="mt-4 text-lg italic">Waiting for Admin to start the game...</p>
                </section>
            }

            {/* end of game */}

            {gameOver &&
                <h2 className="game__game-over text-3xl mt-8">Game Over</h2>
            }

            {/* current round - active game */}

            {gameIsStarted &&

                <section className="game__details flex flex-col items-center">

                    <h4 className="text-xl mt-4">Score: <span className="font-bold">{score.toLocaleString()}</span></h4>

                    <h4 className="mt-4">Round {currentQuestionIndex} / {totalNumberOfQuestions}</h4>
                    {roundOver && !gameOver &&<h4 className="game__point-this-round mt-4 text-xl text-green-500"><span className="font-bold">+{scoreForLastRound}</span> points this round</h4>}

                    {!roundOver && <h4 className="text-xl mt-4">Players answered: {numberOfPlayersAnswered} / {numberOfPlayers}</h4>}

                    {answers.length > 0 &&
                        <ul className="game__answers flex flex-col  gap-4 mt-8">
                            <button className={disabled? "game__answer bg-gray-400 text-gray-100 font-bold rounded-full py-2 px-4":"game__answer bg-gray-300 text-black font-bold rounded-full py-2 px-4" } disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[0]}</button>
                            <button className="game__answer bg-gray-300 text-black font-bold rounded-full py-2 px-4" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[1]}</button>
                            <button className="game__answer bg-gray-300 text-black font-bold rounded-full py-2 px-4" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[2]}</button>
                            <button className="game__answer bg-gray-300 text-black font-bold rounded-full py-2 px-4" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[3]}</button>
                        </ul>
                    }
                </section>
            }

            {/* in Between rounds */}

            {roundOver && !gameOver &&
                <section className="game__skip text-center">
                    <h4 className="mt-8">Skips: {skips} / {numberOfPlayers}</h4>
                    <button className="game__skip-button mt-8 bg-green-300 text-black px-4 py-2 rounded-full w-80 font-bold" onClick={(e) => handleSkip(e)}>Next</button>
                </section>
            }
            
        </main>
    )
}