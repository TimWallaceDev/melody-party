import React, { useEffect } from "react";
// import "./CreateRoom.scss"
import { Socket } from "socket.io-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JoinProps {
    socket: Socket;
}

export function CreateRoom({socket}: JoinProps) {

    const navigate = useNavigate()

    useEffect(() => {
        socket.on("confirm room", (newRoomCode) => {
            navigate(`/admin/${newRoomCode}`)
        })

        socket.on("create room error", (message) => {
            setErrorMessage(message)
        }
    )

        return () => {
            socket.off("confirm room")
            socket.off("create room error")
        }
    }, [])

    const [playlistUrl, setPlaylistUrl] = useState<string>("")
    const [amount, setAmount] = useState<number>(0)
    const [errorMessage, setErrorMessage] = useState<string>("")

    //create a new game room
    function handleCreateGame(e: React.FormEvent) {
        e.preventDefault()
        //clear error message
        setErrorMessage("")
        //check that form is not empty
        if (playlistUrl.length < 1) {
            setErrorMessage("Enter a valid playlist URL")
            return
        }
        if (amount === 0){
            setErrorMessage("Choose amount of rounds")
            return
        }

        socket.emit('create room', playlistUrl, amount);
    }

    function handlePlaylistChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPlaylistUrl(e.target.value)
    }

    function handleAmount(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedAmount: number) {
        setAmount(selectedAmount)

        //remove checked state from all other buttons
        const buttons: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("admin-create__round") as HTMLCollectionOf<HTMLElement>

        for (let i = 0; i < buttons.length; i++) {
            const button: HTMLElement = buttons[i]
            button.classList.remove("bg-purple-900", "text-white");
            button.classList.add("hover:bg-gray-400");
        }
        //make button visually different
        e.currentTarget.classList.add("bg-purple-900", "text-white")
        e.currentTarget.classList.remove("hover:bg-gray-400")
    }

    return (
        <section className="flex flex-col justify-center items-center p-16">

            <h1 className="font-bold text-3xl">Create Room</h1>

            <div className="flex flex-col items-center">
                <p className="mt-8">Enter Spotify playlist URL</p>
                <form onSubmit={(e) => handleCreateGame(e)} className="flex flex-col items-center">
                    <p className="text-red-500 my-2 text-sm">{errorMessage}</p>
                    <input
                        type="text"
                        placeholder="playlist URL eg.https://spotify.com/playlist/123456789"
                        name="playlistUrl"
                        onChange={(e) => handlePlaylistChange(e)}
                        value={playlistUrl}
                        className="px-4 py-2 rounded-full w-80 text-xs bg-gray-300 placeholder:text-gray-700">
                    </input>
                    <div className="flex flex-col items-center">
                        <p className="mt-12">Number of Rounds</p>
                        <div className="flex justify-around mt-2">
                            <button className="admin-create__round bg-gray-300 px-4 py-2 rounded-full m-2 text-black font-bold w-16 flex justify-center items-center hover:bg-gray-400" type="button" onClick={(e) => handleAmount(e, 10)}>10</button>
                            <button className="admin-create__round bg-gray-300 px-4 py-2 rounded-full m-2 text-black font-bold w-16 flex justify-center items-center hover:bg-gray-400" type="button" onClick={(e) => handleAmount(e, 25)}>25</button>
                            <button className="admin-create__round bg-gray-300 px-4 py-2 rounded-full m-2 text-black font-bold w-16 flex justify-center items-center hover:bg-gray-400" type="button" onClick={(e) => handleAmount(e, 50)}>50</button>
                            <button className="admin-create__round bg-gray-300 px-4 py-2 rounded-full m-2 text-black font-bold w-16 flex justify-center items-center hover:bg-gray-400" type="button" onClick={(e) => handleAmount(e, 100)}>Max</button>
                        </div>
                    </div>
                    <button className="bg-green-600 px-4 py-2 rounded-full mt-12 w-80 font-bold text-black hover:bg-green-700">Create Room</button>
                </form>
            </div>

        </section>
    )
}