import React from "react"
// import "./WaitingRoomAdmin.scss"
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
        return <h1 className="text-2xl">Loading</h1>
    }


    return (

        <section className="admin-waiting-room flex flex-col items-center p-8">
            <div className="room-information flex flex-col items-center">
                <h1 className="room-information__playlist-name text-lg capitalize">{playlistData.playlistName}</h1>
                <img className="room-information__playlist-image mt-2" src={playlistData.playlistImg} />
                <h2 className="room-information__room-code mt-8 text-3xl">Room Code: <span className="font-bold">{roomCode.substring(0, 3)} {roomCode.substring(3, 6)}</span></h2>
            </div>
            <div className="players mt-4">
                <h3 className="text-lg">Users in room: </h3>

                <ul className="text-center">
                    {userList && userList.map(user => <li key={user} className="capitalize">{user}</li>)}
                </ul>

                {!userList && 
                <p className="italic mt-2">No players yet...</p>}
            </div>
            <button onClick={handleStartGame} className="admin-waiting-room__start-button mt-8 bg-green-300 text-black px-4 py-2 rounded-full w-80 font-bold">Start Game!</button>
        </section>
    )
}