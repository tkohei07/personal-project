import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from "./contexts/UserContext";
import './index.css';
import App from './App';
import AddBuilding from './components/building/AddBuilding';
import AddHours from './components/hours/AddHours';
import AddReview from './components/review/AddReview';
import ErrorPage from './components/common/ErrorPage';
import EditBuilding from './components/building/EditBuilding';
import Home from './components/common/Home';
import Hours from './components/hours/Hours';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Reviews from './components/review/Reviews';
import MyFavoriteBuildings from './components/favorite/MyFavoriteBuildings';
import PrivateRoute from './components/auth/PrivateRoute';
import MyReviews from './components/review/MyReviews';

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
        path: "/buildings/edit/:id",
        element: (
          <PrivateRoute>
            <EditBuilding />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-building",
        element: (
          <PrivateRoute>
            <AddBuilding />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-hours",
        element: (
        <PrivateRoute>
          <AddHours />
        </PrivateRoute>
        ),
      },
      {
        path: "/my-favorite-buildings",
        element: (
          <PrivateRoute>
            <MyFavoriteBuildings />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-reviews",
        element: (
          <PrivateRoute>
            <MyReviews />
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
      },
      {
        path: "/add-review/:id",
        element: (
          <PrivateRoute>
            <AddReview />
          </PrivateRoute>
        ),
      },
      {
        path: "/reviews/:id",
        element: <Reviews />,
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
