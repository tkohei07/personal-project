import { Link, Outlet } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //       <Link to="/" className="list-group-item list-group-item-action">Home</Link>
  //       <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
  //       </a>
  //     </header>
  //   </div>
  // );

  // const navigate = useNavigate();  

  return (
    // for using bootstrap??
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go Watch a Movie!!!</h1>
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>
              <Link to="/movies" className="list-group-item list-group-item-action">
                Movies
              </Link>
              <Link to="/add-movie" className="list-group-item list-group-item-action">
                Add Movie
              </Link>
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
