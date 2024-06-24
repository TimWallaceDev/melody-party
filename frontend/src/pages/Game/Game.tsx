import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Game.scss"

export function Game({ socket }) {

    const { roomCode } = useParams()
    const [gameIsStarted, setGameIsStarted] = useState(false)
    const [roundOver, setRoundOver] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [answers, setAnswers] = useState([])
    const [playlistData, setPlaylistData] = useState({})
    const [track, setTrack] = useState({})
    const [previewUrl, setPreviewUrl] = useState("")
    const [selectedButton, setSelectedButton] = useState("")
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState("")
    const [numberOfPlayersAnswered, setNumberOfPlayersAnswered] = useState(0)
    const [numberOfPlayers, setNumberOfPlayers] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [skips, setSkips] = useState(0)

    useEffect(() => {
        socket.on('error', (message) => {
            alert(message); // Handle error message (e.g., display to user)
        });

        //next Question
        socket.on("next question", (answers, nextTrack) => {
            setAnswers(answers)
            setGameIsStarted(true)
            setPreviewUrl(nextTrack.track.preview_url)
            setTrack(nextTrack.track.name)
            setNumberOfPlayersAnswered(0)
            setRoundOver(false)
            setSkips(0)
            setAnswer("")

            //remove button styling
            selectedButton.style.backgroundColor = "#ddd"
            setDisabled(false)
        })

        //receive new player
        socket.on('player added', (users, updatedPlaylistData) => {
            setPlaylistData(updatedPlaylistData)
        });

        socket.on("players answered", (newNumberOfPlayersAnswered, newNumberOfPlayers) => {
            setNumberOfPlayersAnswered(newNumberOfPlayersAnswered)
            setNumberOfPlayers(newNumberOfPlayers)
        })

        socket.on("number of skips", (newNumberOfSkips) => {
            setSkips(newNumberOfSkips)
        })

        socket.on("results", (correctAnswer, users) => {
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

            //set user score
            console.log(users[socket.id])
            setScore(users[socket.id].score)
            //set round over
            setRoundOver(true)

        });

        socket.on("game over", (users) => {
            console.log("game over")
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


    function handleSubmitAnswer(e) {
        let selected = e.target.innerText
        setAnswer(selected)
        setSelectedButton(e.target)

        //send answer to server
        socket.emit("answer", roomCode, selected, Date.now())
        setDisabled(true)
    }

    function handleSkip(e) {
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
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[0].track.name}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[1].track.name}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[2].track.name}</button>
                            <button className="game__answer" disabled={disabled} onClick={(e) => handleSubmitAnswer(e)}>{answers[3].track.name}</button>
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