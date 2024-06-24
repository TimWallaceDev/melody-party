import "./Join.scss"
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface JoinProps  {
    socket: Socket;
}

export function Join({socket}: JoinProps) {
    const [roomCode, setRoomCode] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)

    
    const navigate = useNavigate()

    useEffect(() => {
        socket.on('error', (message: string) => {
            alert(message); // Handle error message (e.g., display to user)
        });

        return () => {
            socket.off('error')
        };
    }, []);


    function handleJoin(e: FormEvent) {
        e.preventDefault()
        console.log("joining?")
        //create socket connection
        try {
            //check if room exists
            //check if username available TODO
            //if so save it to session storage
            //redirect to game / roomCode
            socket.emit('join room', roomCode, username);

        } catch (error) {
            console.log(error)
        }

        //redirect to game
        navigate("/game/" + roomCode)
    }


    function handleRoomChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRoomCode(e.target.value)
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value)
    }

    return (
        <main className="join">
            <p>{roomCode}</p>
            <h1>Join A Room</h1>

            <form className="join__form" onSubmit={(e) => handleJoin(e)}>
                <input className="join__form-input" type="text" placeholder="create a username" onChange={(e) => handleUsernameChange(e)}></input>

                <input className="join__form-input" type="number" placeholder="Room Number" onChange={(e) => handleRoomChange(e)}></input>

                <button className="join__form-submit">Join</button>

            </form>
        </main>
    )
}