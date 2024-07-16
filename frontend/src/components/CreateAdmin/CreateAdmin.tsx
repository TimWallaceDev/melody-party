import React from "react";
// import "./CreateAdmin.scss"
import { Socket } from "socket.io-client";
import { useState } from "react";

interface CreateAdminProps  {
    socket: Socket;
    setRoomIsCreated: React.Dispatch<React.SetStateAction<boolean>>,
}

export function CreateAdmin(props: CreateAdminProps) {
    const { socket, setRoomIsCreated } = props

    const [playlistUrl, setPlaylistUrl] = useState<string>("")
    const [amount, setAmount] = useState<number>(0)
    const [errorMessage, setErrorMessage] = useState<string>("")

    //create a new game room
    function handleCreateGame(e: React.FormEvent) {
        e.preventDefault()
        //check that form is not empty
        if (playlistUrl.length < 1){
            setErrorMessage("Enter a valid playlist URL")
            return
        }
        try {
            socket.emit('create room', playlistUrl, amount);
            setRoomIsCreated(true)

            //redirect to /game/admin/roomCode

        } catch (error) {
            console.log(error)
        }
    }

    function handlePlaylistChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPlaylistUrl(e.target.value)
    }

    function handleAmount(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selectedAmount: number) {
        setAmount(selectedAmount)

        //remove checked state from all other buttons
        const buttons: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("admin-create__round") as HTMLCollectionOf<HTMLElement>

        for (let i = 0; i < buttons.length; i++){
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
                    <p>{errorMessage}</p>
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