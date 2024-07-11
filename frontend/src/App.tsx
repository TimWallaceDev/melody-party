import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home.tsx';
import { Admin } from "./pages/Admin/Admin.tsx"
import {Join} from "./pages/Join/Join.tsx"
import { Game } from './pages/Game/Game.tsx';
import { socket } from './components/Socket/Socket.tsx';
import { CreateRoom } from './pages/CreateRoom/CreateRoom.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/create" element={<CreateRoom socket={socket}/>}></Route>
        <Route path="/join" element={<Join socket={socket}/>}></Route>
        <Route path="/game/:roomCode" element={<Game socket={socket}/>}></Route>
        <Route path="/admin/:roomCode" element={<Admin socket={socket}/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
