import { createRoot } from 'react-dom/client'
import './main.css'
import { Editor } from './pages/editor/Editor.jsx'

import { createBrowserRouter,RouterProvider } from "react-router";
import {Player} from "./pages/player/Player.jsx";

import {App} from "./App.jsx";

let router = createBrowserRouter([
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