

export function createRouter(req, res){
    //generate room code
    let roomCode = Math.floor(Math.random() * 999_999)
    console.log(roomCode)
    res.json({roomCode: roomCode})
}