import { useNavigate } from "react-router";
import {useScenarioStore} from "../../stores/scenarioStore.js";

export const ScenarioForm = ({ setShowForm, isNewScenario}) => {
    const navigate = useNavigate();
    const setActiveScenarioId = useScenarioStore(state    => state.setActiveScenarioId)
    async function insertNewScenario(scenarioName) {
        await fetch(`http://localhost:8080/scenario/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: scenarioName })
        })
            .then(r => r.json())
            .then(json => {
                setActiveScenarioId(json[0].id)
            })
            .then(_ => navigate("/editor"));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (isNewScenario){
            const scenarioName = formData.get('scenarioName');
            await insertNewScenario(scenarioName)
        } else {
            const scenarioNr = parseInt(formData.get('scenarioNr'));
            setActiveScenarioId(scenarioNr)
        }
        setShowForm(false);
        navigate('/editor')
    }

    return (
        <form onSubmit={handleSubmit}>
            {isNewScenario ? (
                <label>
                    ScenarioName
                    <input name='scenarioName' defaultValue={'home'} />
                </label>
            ) : (
                <label>
                    ScenarioNr
                    <input name='scenarioNr' defaultValue={1}/>
                </label>
            )}
            <button type='submit'>Submit</button>
        </form>
    );
};
