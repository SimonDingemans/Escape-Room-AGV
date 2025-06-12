import './chat.css';
import {useWsStore} from "../ws.js";

export const Chat = ({ id }) => {
    // Create the role string from the ID
    // Use a selector function that only returns what we need based on role
    const messages = useWsStore(state => state.getMessages(id));

    return (
        <aside className="chat">
            <h1>Messages for {id} side</h1>
            {messages ? messages.map((message, index) => (
                <p key={index}>{message}</p>
            )) :
            null}
        </aside>
    );
};