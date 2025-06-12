import { createRoot } from 'react-dom/client'
import './index.css'
import { Editor } from './pages/editor/Editor.jsx'

import {createBrowserRouter, Navigate, RouterProvider} from "react-router";

import {App} from "./components/App.jsx";
import {Home} from "./pages/home/Home.jsx";
import {Player} from "./pages/player/Player.jsx";


let router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/home" replace />,
    },
    {
        path: "/home",
        Component: Home,
    },
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "editor",
                Component: Editor,
            },
            {
                path: "player",
                Component: Player,
            }
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);