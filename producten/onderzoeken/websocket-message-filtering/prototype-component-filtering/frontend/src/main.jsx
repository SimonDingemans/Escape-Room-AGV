import { createRoot } from 'react-dom/client'

import { createBrowserRouter,RouterProvider } from "react-router";
import {App} from "./pages/app.jsx";


let router = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);