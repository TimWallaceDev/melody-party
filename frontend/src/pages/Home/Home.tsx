import { Link } from 'react-router-dom'
// import "./Home.scss"


export const Home: React.FC = () => {

    return (
        <main className="flex flex-col justify-center items-center p-16">
            <h1 className="text-3xl font-bold">Melody Party</h1>
            <p className="mt-8">Guess your favorite songs with friends!</p>

            <Link to={"/create"} className="home__link">
                <button className="bg-gray-300 px-4 py-2 rounded-full text-black mt-8 w-64 font-bold hover:bg-gray-400">Create a room</button>
            </Link>
            <Link to={"/join"} className="home__link">
                <button className="bg-gray-300 px-4 py-2 rounded-full text-black mt-4 w-64 font-bold hover:bg-gray-400">Join a room</button>
            </Link>
        </main>
    )
}