// import "./Join.scss"
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface JoinProps {
    socket: Socket;
}

export function Join({ socket }: JoinProps) {
    const [roomCode, setRoomCode] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")


    const navigate = useNavigate()

    useEffect(() => {
        //listen for error messages
        socket.on('error', (message: string) => {
            setErrorMessage(message);
        });

        //listen for the join room request to be confirmed
        socket.on("confirm join", (roomCode) => {
            sessionStorage.setItem("username", username)
            navigate(`/game/${roomCode}`)
        })

        return () => {
            socket.off('error')
            socket.off("confirm join")
        };
    }, [username]);


    function handleJoin(e: FormEvent) {
        e.preventDefault()

        if (!username){
            setErrorMessage("please choose a username")
            return
        }
        if (!roomCode){
            setErrorMessage("please enter a room code")
            return
        }
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
        <main className="join flex flex-col items-center p-8">
            <h1 className="text-2xl font-bold">Join A Room</h1>

            <form className="join__form flex flex-col gap-4" onSubmit={(e) => handleJoin(e)}>
                <h4 className="join__error-message text-red-500 mt-4">{errorMessage}</h4>
                <input className="join__form-input bg-gray-300 placeholder:text-gray-600 px-4 py-2 rounded-full text-center placeholder:italic text-black font-bold" type="text" placeholder="create a username" value={username} onChange={(e) => handleUsernameChange(e)}></input>

                <input className="join__form-input bg-gray-300 placeholder:text-gray-600 px-4 py-2 rounded-full text-center text-black placeholder:italic font-bold" type="number" placeholder="Room Number" value={roomCode} onChange={(e) => handleRoomChange(e)}></input>

                <button className="join__form-submit bg-green-300 text-black font-bold px-4 py-2 rounded-full">Join</button>

            </form>
        </main>
    )
}