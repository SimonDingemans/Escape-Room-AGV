import {useWsStore} from "../../ws.js";

export const Timer = () => {
    const timerMessages = useWsStore(state => state.getMessages('timer')) ?? []
    const sendMessage = useWsStore(state => state.sendMessage)

    const timer = timerMessages.length > 0 ? timerMessages[timerMessages.length - 1].currentTime : '00:00';

    return <>
        <div id="timer">
            <p>{timer}</p>
        </div>
        <div id = "timeControl">
            <button type="button" onClick={start}>start</button> <br />
            <button type="button" onClick={pauseAndPlay}>pause/play</button>
            <button type="button" onClick={Speed}>speed</button>
        </div>
    </>

    function start() {
        sendMessage(JSON.stringify({type: 'message', receiver: "TOUCH_DESIGNER", message: [{"type": "start", "value": 1}]}))
    }

    function pauseAndPlay() {
        sendMessage(JSON.stringify({type: 'message', receiver: "TOUCH_DESIGNER", message: [{"type": "pause", "value": 0}]}))
    }

    function Speed() {
        sendMessage(JSON.stringify({type: 'message', receiver: "TOUCH_DESIGNER", message: [{"type": "speed", "value": 0}]}))
    }
}