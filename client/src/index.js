import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from "./UserContext";
import './index.css';
import App from './App';
import AddBuilding from './components/AddBuilding';
import AddHours from './components/AddHours';
import ErrorPage from './components/ErrorPage';
import Buildings from './components/Buildings';
import EditBuilding from './components/EditBuilding';
import Home from './components/Home';
import Hours from './components/Hours';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/buildings",
        element: <Buildings />,
      },
      {
        path: "/buildings/edit/:id",
        element: (
          <PrivateRoute>
            <EditBuilding />,
          </PrivateRoute>
        ),
      },
      {
        path: "/add-building",
        element: (
          <PrivateRoute>
            <AddBuilding />,
          </PrivateRoute>
        ),
      },
      {
        path: "/add-hours",
        element: (
        <PrivateRoute>
          <AddHours />,
        </PrivateRoute>
        ),
      },
      {
        path: "/hours/:id",
        element: <Hours />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
