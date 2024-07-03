import axios from "axios"
import "dotenv/config"

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
        console.log({body})
        //request token from spotify
        const response = await axios.post("https://accounts.spotify.com/api/token", body, headers)
        console.log("token is successful")
        return response.data.access_token
    
    }catch(err){
        console.log("token error")
        return "token error"
    }
}