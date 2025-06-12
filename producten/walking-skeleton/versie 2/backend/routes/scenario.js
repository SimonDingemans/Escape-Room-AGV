const express = require('express');
const router = express.Router();
const Scenario = require("../domain/scenario/scenario")
const {getScenario, insertScenario} = require("../domain/scenario/model")
const {getFases} = require("../domain/fase/model")
const {getEvents} = require("../domain/event/model")
const {insertFase} = require("../domain/fase/model")


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const scenario = await getScenario(id);
        const fases = await getFases(id);

        let events = [];
        for (const fase of fases) {
            const faseEvents = await getEvents(fase.id);
            events.push(faseEvents);
        }
        events = events.flat()

        res.send({scenario: scenario, fases: fases , events: events});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    let scenario = new Scenario(null, name)
    try {
        scenario = await insertScenario(scenario)
        await insertFase(scenario[0].id)
        res.send(scenario)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;