import {Chat} from "../components/chat.jsx";

import './app.css'

export const App = () => {
    return <main className="app">
        <Chat id={'left'}/>
        <Chat id={'right'}/>
    </main>
}