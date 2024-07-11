// Socket setup outside the components
import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL as string;
const socket = io(backendURL, {
  path: "/socket"
});

export { socket };
