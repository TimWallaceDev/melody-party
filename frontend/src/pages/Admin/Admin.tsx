import "./Admin.scss"
import { useState, useEffect, useRef } from "react";
import { CreateAdmin } from "../../components/CreateAdmin/CreateAdmin.tsx";
import { WaitingRoomAdmin } from "../../components/WaitingRoomAdmin/WaitingRoomAdmin.tsx";
import { GameAdmin } from "../../components/GameAdmin/GameAdmin.tsx";
import { GameOverAdmin } from "../../components/GameOverAdmin/GameOverAdmin.tsx";
import { RoundOverAdmin } from "../../components/RoundOverAdmin/RoundOverAdmin.tsx";
import { Socket } from "socket.io-client";

interface AdminProps  {
    socket: Socket;
}

export function Admin({ socket }: AdminProps) {

    const [userList, setUserList] = useState<string[] | null>(null)
    const [roomCode, setRoomCode] = useState<string | null>(null)
    const [roomIsCreated, setRoomIsCreated] = useState<boolean>(false)
    const [gameIsStarted, setGameIsStarted] = useState<boolean>(false)
    const [answers, setAnswers] = useState<string[]>([])
    const [playlistUrl, setPlaylistUrl] = useState<string>("")
    const [playlistData, setPlaylistData] = useState<{playlistImg: string; playlistName: string;} | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [roundOver, setRoundOver] = useState<boolean>(true)
    const [numberOfPlayersAnswered, setNumberOfPlayersAnswered] = useState<number>(0)
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0)
    const [amount, setAmount] = useState<number>(0)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [scores, setScores] = useState({})
    const [correctAnswer, setCorrectAnswer] = useState<string>("")

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        //generate room code
        setRoomCode(Math.floor(Math.random() * 999_999).toString())

        socket.on("playlist data", (somePlaylistData) => {
            console.log("updated playlist data: " , somePlaylistData)
            setPlaylistData(somePlaylistData)
        })

        //next Question
        socket.on("next question", (answers, nextTrack) => {
            setAnswers(answers)
            setPreviewUrl(nextTrack.track.preview_url)
            setRoundOver(false)
            setNumberOfPlayersAnswered(0)
            setRoundOver(false)
        })

        //receive new player
        socket.on('player added', (users, updatedPlaylistData) => {
            setUserList(users);
            setPlaylistData(updatedPlaylistData)
        });

        socket.on("players answered", (newNumberOfPlayersAnswered, newNumberOfPlayers) => {
            setNumberOfPlayersAnswered(newNumberOfPlayersAnswered)
            setNumberOfPlayers(newNumberOfPlayers)
        })

        socket.on('results', (newCorrectAnswer, users) => {
            setRoundOver(true)
            setScores(users)
            setCorrectAnswer(newCorrectAnswer)
        });

        socket.on("game over", (users) => {
            console.log("game over")
            setScores(users)
            setRoundOver(true)
            setGameOver(true)
        })

        return () => {
            socket.off('player answered');
            socket.off('player added');
            socket.off('next question');
            socket.off('results');
            socket.off('game over');
        };

    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play()
        }
    }, [previewUrl])

    if (!roomCode) {
        return <h1>Loading</h1>
    }

    return (
        <main className="admin">

            <audio src={previewUrl} autoPlay ref={audioRef}></audio>

            {!roomIsCreated &&
                <CreateAdmin
                    socket={socket}
                    roomCode={roomCode}
                    setRoomIsCreated={setRoomIsCreated}
                    setPlaylistUrl={setPlaylistUrl}
                    playlistUrl={playlistUrl}
                    amount={amount}
                    setAmount={setAmount}
                />
            }

            {roomIsCreated && !gameIsStarted &&
                <WaitingRoomAdmin
                    socket={socket}
                    userList={userList}
                    roomCode={roomCode}
                    setGameIsStarted={setGameIsStarted}
                    playlistData={playlistData}
                />
            }

            {roomIsCreated && gameIsStarted && !gameOver &&
                <GameAdmin
                    socket={socket}
                    roomCode={roomCode}
                    playlistData={playlistData}
                    numberOfPlayers={numberOfPlayers}
                    numberOfPlayersAnswered={numberOfPlayersAnswered}
                    answers={answers}
                    roundOver={roundOver}
                    setRoundOver={setRoundOver}
                    correctAnswer={correctAnswer}
                />
            }

            {roomIsCreated && gameIsStarted && !gameOver && roundOver &&

                <RoundOverAdmin
                    socket={socket}
                    roomCode={roomCode}
                    scores={scores}
                />
            }

            {gameOver &&
                <GameOverAdmin scores={scores} />
            }
        </main>
    )
}