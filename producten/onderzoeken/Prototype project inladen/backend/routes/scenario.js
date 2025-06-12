// domain/scenario/scenario.js
const express = require('express');
const {getScenario, insertScenario} = require("../domain/scenario/scenarioModel");
const router = express.Router();
const Scenario = require("../domain/scenario/scenario");  // no destructuring

// Define a route
router.get('/:id', async (req, res) => {
    const { id } =  req.params;
    console.log(id);
    try {
        const scenario = await getScenario(id)
        res.send(scenario)
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    const scenarioDTO = new Scenario(null, name)
    try {
        const scenario = await insertScenario(scenarioDTO)
        res.send(scenario)
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
// export the router module so that server.js file can use it
module.exports = router;