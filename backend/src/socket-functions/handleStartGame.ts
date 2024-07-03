import { io } from '../server';

export function handleStartGame(roomCode: string) {
    io.to(roomCode).emit("start game", roomCode)
}