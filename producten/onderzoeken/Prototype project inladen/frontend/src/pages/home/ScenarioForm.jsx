import { useNavigate } from "react-router";

export const ScenarioForm = ({ setShowForm, clickOnScenario, isNewScenario}) => {
    const navigate = useNavigate();

    function fetchScenario(scenarioNr) {
        fetch(`http://localhost:8080/scenario/${scenarioNr}`, {
            method: 'GET',
        })
            .then(r => r.json())
            .then(json => {
                console.log(JSON.stringify(json));
            });

    }

    function insertNewScenario(scenarioName) {
        fetch(`http://localhost:8080/scenario/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: scenarioName })
        })
            .then(r => r.json())
            .then(json => {
                console.log(JSON.stringify(json));
            });
    }
    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (isNewScenario){
            const scenarioName = formData.get('scenarioName');
            insertNewScenario(scenarioName)
        } else {
            const scenarioNr = parseInt(formData.get('scenarioNr'));
            fetchScenario(scenarioNr);
        }
        setShowForm(false);
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
