import {useWsStore} from "../../../stores/wsStore.js";

export const Timer = () => {
    const timer = useWsStore(state => state.timer);

    const minutes = Math.floor(timer / 60);
    const seconds = Math.floor(timer % 60);

    return <div>
        {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
}