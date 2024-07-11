import "./Join.scss"
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface JoinProps {
    socket: Socket;
}

export function Join({ socket }: JoinProps) {
    const [roomCode, setRoomCode] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>("")


    const navigate = useNavigate()

    useEffect(() => {
        socket.on('error', (message: string) => {
            setErrorMessage(message);
        });

        socket.on("confirm join", (roomCode) => {
            navigate(`/game/${roomCode}`)
        })

        return () => {
            socket.off('error')
            socket.off("confirm join")
        };
    }, []);


    function handleJoin(e: FormEvent) {
        e.preventDefault()

        //request to join room
        socket.emit('join room', roomCode, username);
    }


    function handleRoomChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRoomCode(e.target.value)
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value)
    }

    return (
        <main className="join">
            <h1>Join A Room</h1>

            <form className="join__form" onSubmit={(e) => handleJoin(e)}>
                <h4 className="join__error-message">{errorMessage}</h4>
                <input className="join__form-input" type="text" placeholder="create a username" onChange={(e) => handleUsernameChange(e)}></input>

                <input className="join__form-input" type="number" placeholder="Room Number" onChange={(e) => handleRoomChange(e)}></input>

                <button className="join__form-submit">Join</button>

            </form>
        </main>
    )
}