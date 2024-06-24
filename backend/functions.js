import axios from 'axios';
import 'dotenv/config';
import { rooms } from './server.js';
import shuffle from "shuffle-array"


export async function getToken() {
    console.log("token request")

    try {
        const headers = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    
        //body needs client ID and client secret
        const body = {
            grant_type: "client_credentials",
            client_id: `${process.env.VITE_SPOTIFY_CLIENT_ID}`,
            client_secret: `${process.env.VITE_SPOTIFY_SECRET}`
        }
        //request token from spotify
        let response = await axios.post("https://accounts.spotify.com/api/token", body, headers)
        return response.data.access_token
    
    }catch(err){
        console.log(err)
        return "token error"
    }
}

export async function getPlaylistTracks(playlistId) {
    const token = await getToken()
    try {
        //create header with token
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        //get tracks from spotify
        let response = await axios.get("https://api.spotify.com/v1/playlists/" + playlistId, config)
        const playlistImg = response.data.images[0].url
        const playlistName = response.data.name
        // const playlistTracks = response.data.tracks.items
        //filter only items with a preview URL
        const playlistTracks = shuffle(response.data.tracks.items.filter(track => track.track.preview_url ?  true : false))


        const playlistData = {playlistImg, playlistName, playlistTracks}

        return playlistData

    } catch (err) {
        console.log(err)
        console.error("playlist error")
        return "playlist error"
    }
}


export async function getNextTrack(room){

}

export function getRandomTracks(tracks, correctIndex){
    const length = tracks.length
    const randomIndices = [correctIndex]
    let randomIndex = Math.floor(Math.random() * length)

    for (let i = 0; i < 3; i++){
        while(randomIndices.includes(randomIndex)){
            randomIndex = Math.floor(Math.random() * length)
        }
        randomIndices.push(randomIndex)
    }
    console.log(shuffle(randomIndices))

    return shuffle(randomIndices)
}