import React from "react"
import "./WaitingRoomAdmin.scss"
import { Socket } from "socket.io-client"

interface WaitingRoomProps {
    socket: Socket,
    userList: string[] | null,
    roomCode: string,
    setGameIsStarted: React.Dispatch<React.SetStateAction<boolean>>,
    playlistData:  {playlistImg: string; playlistName: string;} | null,
}

export function WaitingRoomAdmin({ socket, userList, roomCode, setGameIsStarted, playlistData }: WaitingRoomProps) {

    function handleStartGame() {
        socket.emit("next question", roomCode)
        setGameIsStarted(true)
    }

    if (!playlistData){
        return <h1>Loading</h1>
    }


    return (

        <section className="admin-waiting-room">
            <div className="room-information">
                <img className="room-information__playlist-image" src={playlistData.playlistImg} />
                <h1 className="room-information__playlist-name">{playlistData.playlistName}</h1>
                <h2 className="room-information__room-code">Room Code: {roomCode}</h2>
            </div>
            <div className="players">
                <h3>Users in room</h3>

                <ul>
                    {userList && userList.map(user => <li key={user}>{user}</li>)}
                </ul>
            </div>
            <button onClick={handleStartGame}>Start Game!</button>
        </section>
    )
}