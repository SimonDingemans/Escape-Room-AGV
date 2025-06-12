import { createRoot } from 'react-dom/client'
import './index.css'
import { Editor } from './pages/editor/Editor.jsx'

import { createBrowserRouter,RouterProvider } from "react-router";

import {App} from "./App.jsx";
import {Home} from "./pages/home/Home.jsx";

let router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "/",
                Component: Home,
            },
            {
                path: "editor",
                Component: Editor,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);