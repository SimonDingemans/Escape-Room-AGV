import React from "react";
import {Draggable} from "./Draggable.jsx";

export const Sidebar = () => {
    return <aside>
        <Draggable id="MOVIE">Video</Draggable>
        <div style={{marginTop: '1rem', width: '15rem', maxWidth: '20rem', overflow: "scroll"}}></div>
    </aside>
}