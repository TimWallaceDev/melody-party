import React, { useEffect } from "react";
import "./CreateRoom.scss"
import { Socket } from "socket.io-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateRoom(socket: Socket) {

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
        //check that form is not empty
        setErrorMessage("")
        if (playlistUrl.length < 1) {
            setErrorMessage("Enter a valid playlist URL")
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
            button.style.backgroundColor = "white"
        }
        //make button visually different
        e.currentTarget.style.backgroundColor = "green"
    }

    return (
        <section className="admin-create">

            <h1>Create Room</h1>

            <div className="admin-create__controls">
                <p className="admin-create__playlist-input-label">Enter Spotify playlist URL</p>
                <form onSubmit={(e) => handleCreateGame(e)}>
                    <p className="admin-create__error-message">{errorMessage}</p>
                    <input
                        type="text"
                        placeholder="playlist URL eg.https://spotify.com/playlist/123456789"
                        name="playlistUrl"
                        onChange={(e) => handlePlaylistChange(e)}
                        value={playlistUrl}
                        className="admin-create__playlist-input">
                    </input>
                    <div className="admin-create__rounds">
                        <p className="admin-create__rounds-label">Number of Rounds</p>
                        <div className="admin-create__buttons">
                            <button className="admin-create__round" type="button" onClick={(e) => handleAmount(e, 10)}>10</button>
                            <button className="admin-create__round" type="button" onClick={(e) => handleAmount(e, 25)}>25</button>
                            <button className="admin-create__round" type="button" onClick={(e) => handleAmount(e, 50)}>50</button>
                            <button className="admin-create__round" type="button" onClick={(e) => handleAmount(e, 100)}>Max</button>
                        </div>
                    </div>
                    <button className="admin-create__submit">Create Room</button>
                </form>
            </div>

        </section>
    )
}