import { Link } from 'react-router-dom';

const Home = () => {

    return(
        <>
        <div className="text-center">
            <h2>Let's find a movie to watch tonight</h2>
            <hr />
            <Link to="/movies">
                Movies
            </Link>
        </div>
        </>
    )
}

export default Home;