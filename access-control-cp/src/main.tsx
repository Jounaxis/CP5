import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Cad from './routes/Cad';
import Error from './routes/Error';

const router = createBrowserRouter([
    {path: "/", element: <App/>, errorElement: <Error/>,
    children: [
      { path: "/", element: <Home /> },
    ]
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: "/cadastro",
    element: <Cad />,
    errorElement: <Error />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
