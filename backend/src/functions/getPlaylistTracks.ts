import axios from "axios"
import { getToken } from "./getToken"
import shuffle from "shuffle-array"
import { Track } from "../interface definitions/interfaceDefinitions"

export async function getPlaylistTracks(playlistId: string): Promise<{playlistImg: string, playlistName: string,  playlistTracks: Track[]} | "playlist error">
{
    const token = await getToken()
    try {
        //create header with token
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        //get tracks from spotify
        const response = await axios.get("https://api.spotify.com/v1/playlists/" + playlistId, config)
        const playlistImg = response.data.images[0].url
        const playlistName = response.data.name
        //filter only items with a preview URL
        const playlistTracks: Track[] = shuffle(response.data.tracks.items.filter((track: Track) => track.track.preview_url ?  true : false))
        const playlistData: {playlistImg: string, playlistName: string,  playlistTracks: Track[]} = {playlistImg, playlistName, playlistTracks}

        return playlistData

    } catch (err) {
        console.log(err)
        console.error("playlist error")
        return "playlist error"
    }
}