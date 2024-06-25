import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Game.scss"
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
    const [playlistData, setPlaylistData] = useState<any>({})
    // const [previewUrl, setPreviewUrl] = useState("")
    const [selectedButton, setSelectedButton] = useState<any>("")
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState("")
    const [numberOfPlayersAnswered, setNumberOfPlayersAnswered] = useState(0)
    const [numberOfPlayers, setNumberOfPlayers] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [skips, setSkips] = useState(0)

    useEffect(() => {
        socket.on('error', (message: string) => {
            alert(message); // Handle error message (e.g., display to user)
        });

        //next Question
        socket.on("next question", (answers: string[], nextTrack: any) => {
            setAnswers(answers)
            setGameIsStarted(true)
            // setPreviewUrl(nextTrack.track.preview_url)
            setNumberOfPlayersAnswered(0)
            setRoundOver(false)
            setSkips(0)
            setAnswer("")

            //remove button styling
            selectedButton.style.backgroundColor = "#ddd"
            setDisabled(false)
        })

        //receive new player
        socket.on('player added', (users: any, updatedPlaylistData: any) => {
            console.log(users)
            setPlaylistData(updatedPlaylistData)
        });

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
            if (currentAnswer === correctAnswer) {
                selectedButton.style.backgroundColor = "green"
            }
            else {
                if (answer) {
                    selectedButton.style.backgroundColor = "red"
                    //set the correct answer green
                }
            }
            const index: string | undefined = socket.id
            //set user score
            console.log(users[index || 0])
            setScore(users[index || 0].score)
            //set round over
            setRoundOver(true)

        });

        socket.on("game over", (users: any) => {
            console.log("game over")
            console.log(users)
            setGameOver(true)
        })

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


    function handleSubmitAnswer(e: any) {
        let selected = e.target.innerText
        setAnswer(selected)
        setSelectedButton(e.target)

        //send answer to server
        socket.emit("answer", roomCode, selected, Date.now())
        setDisabled(true)
    }

    function handleSkip(e: any) {
        //send skip vote to server
        socket.emit("skip", roomCode)

        e.target.disabled = true;
    }

    return (

        <main className="game">
            {/* always available information */}
            <section className="game__information">

                <h2>{playlistData?.playlistName ? playlistData.playlistName : "loading"}</h2>
                <img className="game__image" src={playlistData?.playlistImg ? playlistData.playlistImg : ""} alt="playlist art" />

            </section>

            {/* waiting room */}
            {!gameIsStarted &&
                <section className="game-waitingroom">
                    <h1>Welcome to the game</h1>
                    <p>Waiting for Admin to start the game...</p>
                </section>
            }

            {/* end of game */}

            {gameOver &&
                <h2>Game Over</h2>
            }

            {/* current round - active game */}

            {gameIsStarted &&

                <section className="game__details">

                    <h4>Score: {score}</h4>
                    <h4>Players answered: {numberOfPlayersAnswered}/{numberOfPlayers}</h4>

                    {answers.length > 0 &&
                        <ul className="game__answers">
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[0]}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[1]}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[2]}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[3]}</button>
                        </ul>
                    }
                </section>
            }

            {/* in Between rounds */}

            {roundOver &&
                <section className="game__skip">
                    <h4>Skips: {skips}/{numberOfPlayers}</h4>
                    <button className="game__skip-button" onClick={(e) => handleSkip(e)}>Next</button>
                </section>
            }

            
        </main>
    )
}