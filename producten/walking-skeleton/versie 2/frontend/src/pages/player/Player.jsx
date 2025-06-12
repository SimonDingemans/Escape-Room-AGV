// HTTP request functions
import {useWsStore} from "../../stores/wsStore.js";
import {useEffect} from "react";
import {useScenarioStore} from "../../stores/scenarioStore.js";
import {Timer} from "./components/Timer.jsx";

const playRequest = async (scenarioId) => {
    try {
        const response = await fetch('http://localhost:8080/escaperoom/play/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scenarioId, speed: 1 })
        });
        if (!response.ok) {
            throw new Error(`Play request failed: ${response.status}`);
        }
        console.log('Play request successful');
    } catch (error) {
        console.error('Error in play request:', error);
    }
};

const pauseRequest = async () => {
    try {
        const response = await fetch('http://localhost:8080/escaperoom/pause', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Pause request failed: ${response.status}`);
        }
        console.log('Pause request successful');
    } catch (error) {
        console.error('Error in pause request:', error);
    }
};

const resumeRequest = async () => {
    try {
        const response = await fetch('http://localhost:8080/escaperoom/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Resume request failed: ${response.status}`);
        }
        console.log('Resume request successful');
    } catch (error) {
        console.error('Error in resume request:', error);
    }
};

const stopRequest = async () => {
    try {
        const response = await fetch('http://localhost:8080/escaperoom/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Stop request failed: ${response.status}`);
        }
        console.log('Stop request successful');
    } catch (error) {
        console.error('Error in stop request:', error);
    }
};

const setSpeedRequest = async (speed) => {
    try {
        const response = await fetch('http://localhost:8080/escaperoom/speed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ speed })
        });
        if (!response.ok) {
            throw new Error(`Speed request failed: ${response.status}`);
        }
        console.log(`Speed set to ${speed}x successful`);
    } catch (error) {
        console.error(`Error setting speed to ${speed}x:`, error);
    }
};

export const Player = () => {
    console.log("PLAYER")
    const activeScenarioId = useScenarioStore(state => state.activeScenarioId);
    const connect = useWsStore(state => state.connect);
    const disconnect = useWsStore(state => state.disconnect);

    useEffect(() => {
        connect('OPERATOR');

        return () => disconnect();
    }, [])

    return <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Timer />
        <button onClick={(e) => {
            e.preventDefault();
            playRequest(activeScenarioId);
        }}>
            Play
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            pauseRequest();
        }}>
            Pause
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            resumeRequest();
        }}>
            Resume
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            stopRequest();
        }}>
            Stop
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            setSpeedRequest(1);
        }}>
            Speed 1
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            setSpeedRequest(2);
        }}>
            Speed 2
        </button>
        <button onClick={(e) => {
            e.preventDefault();
            setSpeedRequest(5);
        }}>
            Speed 5
        </button>
    </div>
}