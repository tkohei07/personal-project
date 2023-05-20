import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import AddBuilding from './components/AddBuilding';
import AddHours from './components/AddHours';
import ErrorPage from './components/ErrorPage';
import Buildings from './components/Buildings';
import EditBuilding from './components/EditBuilding';
import Home from './components/Home';
import Hours from './components/Hours';

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
        element: <EditBuilding />,
      },
      {
        path: "/add-building",
        element: <AddBuilding />,
      },
      {
        path: "/add-hours",
        element: <AddHours />,
      },
      {
        path: "/hours/:id",
        element: <Hours />,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

