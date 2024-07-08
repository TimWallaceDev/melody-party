import axios from "axios"
import { AxiosResponse } from "axios"
import "dotenv/config"

export async function getToken() {

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
        const response: AxiosResponse<any, any> = await axios.post("https://accounts.spotify.com/api/token", body, headers)
        return response.data.access_token
    
    }catch(err){
        console.error("token error")
        return "token error"
    }
}