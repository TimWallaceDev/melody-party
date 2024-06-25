import React from "react";
import "./CreateAdmin.scss"
import { Socket } from "socket.io-client";

interface CreateAdminProps  {
    socket: Socket;
    roomCode: string,
    setRoomIsCreated: React.Dispatch<React.SetStateAction<boolean>>,
    playlistUrl: string,
    setPlaylistUrl: React.Dispatch<React.SetStateAction<string>>,
    amount: Number,
    setAmount: React.Dispatch<React.SetStateAction<number>>,
}

export function CreateAdmin(props: CreateAdminProps) {
    const { socket, roomCode, setRoomIsCreated, setPlaylistUrl, playlistUrl, amount, setAmount } = props

    //create a new game room
    function handleCreateGame(e: React.FormEvent) {
        e.preventDefault()
        try {
            console.log("creating room")
            socket.emit('create room', roomCode, "admin", playlistUrl, amount);
            setRoomIsCreated(true)

            //redirect to /game/admin/roomCode

        } catch (error) {
            console.log(error)
        }
    }

    function handlePlaylistChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPlaylistUrl(e.target.value)
    }

    function handleAmount(e: any, selectedAmount: number) {
        setAmount(selectedAmount)

        //remove checked state from all other buttons
        const buttons = document.getElementsByClassName("admin-create__round")

        for (let button of buttons){
            button.style.backgroundColor = "white"
        }
        //make button visually different
        e.target.style.backgroundColor = "green"

    }

    return (
        <section className="admin-create">

            <h1>Create Room</h1>

            <div className="admin-create__controls">
                <p>Enter Spotify playlist URL eg. https://open.spotify.com/playlist/123456789</p>
                <form onSubmit={(e) => handleCreateGame(e)}>
                    <input
                        type="text"
                        placeholder="playlist URL eg.https://spotify.com/playlist/123456789"
                        name="playlistUrl"
                        onChange={(e) => handlePlaylistChange(e)}
                        value={playlistUrl}
                        className="admin-create__playlist-input">
                    </input>
                    <div className="admin-create__rounds">
                        <p>Number of Rounds</p>
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