import './App.css'
import {Outlet} from "react-router";
import {TdState} from "./TdState.jsx";

export const App = () => {
    return (
        <>
            <header style={{display: 'flex', justifyContent: 'right'}}>
                <TdState/>
            </header>
            <Outlet/>
        </>
    )
}
