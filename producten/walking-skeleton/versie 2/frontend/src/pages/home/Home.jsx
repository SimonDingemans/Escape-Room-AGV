import { useState } from "react";
import { ScenarioForm } from "./ScenarioForm.jsx";
import HardwareButton from "../../components/Hardwarebutton.jsx";

export const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [isNewScenario, setNewScenario] = useState(false)

    return (
        <>
            <HardwareButton/>

            <button onClick={() => {
                setNewScenario(true)
                setShowForm(true)
            } }>
                New Project
            </button>

            <button onClick={() => setShowForm(true)}>
                Load Project
            </button>

            {showForm ?
                <ScenarioForm
                    setShowForm={setShowForm}
                    isNewScenario={isNewScenario}
                />
            : null }
        </>
    );
};
