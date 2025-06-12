import { useState } from "react";
import { ScenarioForm } from "./ScenarioForm.jsx";

export const Home = () => {
    const [data, setData] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isNewScenario, setNewScenario] = useState(false)

    return (
        <>
            <button onClick={() => {
                setNewScenario(true)
                setShowForm(true)
            } }>New Project</button>
            <button onClick={() => setShowForm(true)}>Known Project</button>

            {showForm ? (
                <ScenarioForm
                    setShowForm={setShowForm}
                    isNewScenario={isNewScenario}
                />
            ) : (
                <>
                    <h3>Data</h3>
                    {data}
                </>
            )}
        </>
    );
};
