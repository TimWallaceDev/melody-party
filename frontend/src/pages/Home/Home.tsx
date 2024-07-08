import { Link } from 'react-router-dom'
import "./Home.scss"


export const Home: React.FC = () => {

    return (
        <main className="home">
            <h1>Melody Mastermind</h1>
            <p>The #1 Music party game</p>

            <Link to={"/create"} className="home__link">
                <button className="home__button">Create a room</button>
            </Link>
            <Link to={"/join"} className="home__link">
                <button className="home__button">Join a room</button>
            </Link>
        </main>
    )
}