import "./Admin.scss"
import { useState, useEffect, useRef } from "react";
import { WaitingRoomAdmin } from "../../components/WaitingRoomAdmin/WaitingRoomAdmin.tsx";
import { GameAdmin } from "../../components/GameAdmin/GameAdmin.tsx";
import { GameOverAdmin } from "../../components/GameOverAdmin/GameOverAdmin.tsx";
import { RoundOverAdmin } from "../../components/RoundOverAdmin/RoundOverAdmin.tsx";
import { Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

interface AdminProps {
    socket: Socket;
}

export function Admin({ socket }: AdminProps) {

    const [userList, setUserList] = useState<string[] | null>(null)
    const [gameIsStarted, setGameIsStarted] = useState<boolean>(false)
    const [answers, setAnswers] = useState<string[]>([])
    const [playlistData, setPlaylistData] = useState<{ playlistImg: string; playlistName: string; } | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [roundOver, setRoundOver] = useState<boolean>(true)
    const [numberOfPlayersAnswered, setNumberOfPlayersAnswered] = useState<number>(0)
    const [numberOfPlayers, setNumberOfPlayers] = useState<number>(0)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [scores, setScores] = useState({})
    const [correctAnswer, setCorrectAnswer] = useState<string>("")
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [totalNumberOfQuestions, setTotalNumberOfQuestions] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const { roomCode } = useParams()
    const navigate = useNavigate()

    useEffect(() => {

        socket.on("playlist data", (somePlaylistData) => {
            if (somePlaylistData === "room does not exist") {
                navigate("/create")
            }
            setPlaylistData(somePlaylistData)
        })

        //next Question
        socket.on("next question", (answers: string[], newPreviewUrl: string, updatedNumberOfPlayers: number, updatedQuestionIndex, updatedNumberOfQuestions) => {
            setAnswers(answers)
            setPreviewUrl(newPreviewUrl)
            setRoundOver(false)
            setNumberOfPlayersAnswered(0)
            setRoundOver(false)
            setNumberOfPlayers(updatedNumberOfPlayers)
            setCurrentQuestionIndex(updatedQuestionIndex)
            setTotalNumberOfQuestions(updatedNumberOfQuestions)
        })

        //receive new player
        socket.on('player added', (users, updatedPlaylistData) => {
            setUserList(users);
            setNumberOfPlayers(Object.keys(users).length)
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
            setScores(users)
            setRoundOver(true)
            setGameOver(true)
        })

        //get playlist data
        socket.emit("get playlist data", roomCode)

        return () => {
            socket.off('playlist data')
            socket.off('player answered');
            socket.off('player added');
            socket.off('next question');
            socket.off('results');
            socket.off('game over');
        };

    }, []);


    useEffect(() => {
        try {
            if (audioRef.current) {
                audioRef.current.play()
            }
        } catch (e) {
            console.warn(e)
        }
    }, [previewUrl])


    if (!gameIsStarted && roomCode) {
        return (
            <WaitingRoomAdmin
                socket={socket}
                userList={userList}
                roomCode={roomCode}
                setGameIsStarted={setGameIsStarted}
                playlistData={playlistData}
            />
        )
    }

    if (gameOver) {
        return (
            <GameOverAdmin scores={scores} />
        )
    }

    return (
        <main className="admin">

            <audio src={previewUrl} autoPlay ref={audioRef}></audio>

            {gameIsStarted && !gameOver &&
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
                    currentIndex={currentQuestionIndex}
                    totalQuestions={totalNumberOfQuestions}
                />
            }

            {gameIsStarted && !gameOver && roundOver &&

                <RoundOverAdmin
                    socket={socket}
                    roomCode={roomCode}
                    scores={scores}
                />
            }

        </main>
    )
}