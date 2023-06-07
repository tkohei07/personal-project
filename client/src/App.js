import { Link, Outlet } from 'react-router-dom';
import { useUser } from './UserContext';

// import logo from './logo.svg';
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
  //       <Link to="/buildings" className="list-group-item list-group-item-action">Movies</Link>
  //       </a>
  //     </header>
  //   </div>
  // );

  // const navigate = useNavigate();  

  const { loggedIn, setLoggedIn } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Let's find the place where you can study</h1>
          <div className="col text-end">
            {loggedIn ? (
              <button onClick={handleLogout}>
                <span className="badge bg-success">Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <span className="badge bg-success">Login</span>
              </Link>
            )}
          </div>
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
              <Link to="/buildings" className="list-group-item list-group-item-action">
                All Buildings
              </Link>
              {loggedIn && (
                <>
                  <Link to="/add-building" className="list-group-item list-group-item-action">
                    Add Building
                  </Link>
                  <Link to="/add-hours" className="list-group-item list-group-item-action">
                    Add Hours
                  </Link>
                  <Link to="/favorite-buildings" className="list-group-item list-group-item-action">
                    Saved Buildings
                  </Link>
                  <Link to="/your-reviews" className="list-group-item list-group-item-action">
                    Your Reviews
                  </Link>
                </>
              )}
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