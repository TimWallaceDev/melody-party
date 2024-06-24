import "./GameOverAdmin.scss"


export function GameOverAdmin({scores}: any) {

    console.log(scores)

    return (
        <section className="admin-game__game-over">
            <h1>Game Over</h1>

            <h2>Rankings</h2>
            <ul>
                <li>1st: </li>
                <li>2nd: </li>
                <li>3rd: </li>
            </ul>
        </section>
    )
}