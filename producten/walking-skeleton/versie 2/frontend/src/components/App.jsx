import './App.css'
import {Link, Outlet} from "react-router";
import {useEffect} from "react";
import {useScenarioStore} from "../stores/scenarioStore.js";
import {ConnectionState} from "./ConnectionState.jsx";

export const App = () => {
    const activeScenarioId = useScenarioStore(state => state.activeScenarioId);
    const scenario = useScenarioStore(state => state.scenario);
    const devices = useScenarioStore(state => state.devices);
    const setScenario = useScenarioStore(state => state.setScenario);
    const setFases = useScenarioStore(state => state.setFases);
    const setEvents = useScenarioStore(state => state.setEvents);
    const setDevices = useScenarioStore(state => state.setDevices);

    useEffect(() => {
        const fetchData = async () => {
            const scenarioResult = await fetch(`http://localhost:8080/scenario/${activeScenarioId}`).then(response => response.json())
            setScenario(scenarioResult.scenario)
            setFases(scenarioResult.fases)
            setEvents(scenarioResult.events)
            const devicesResult = await fetch(`http://localhost:8080/device`).then(response => response.json())
            setDevices(devicesResult)
        }
        fetchData()
    }, []);

    if (!scenario || !devices) return null;

    return (
        <>
            <header style={{display: 'flex', justifyContent: 'right'}}>
                <ConnectionState/>
            </header>
            <nav style={{display: 'flex', justifyContent: 'space-around'}}>
                <Link to={"/editor"}>Editor</Link>
                <Link to={"/player"}>Player</Link>
            </nav>
            <Outlet/>
        </>
    )
}
