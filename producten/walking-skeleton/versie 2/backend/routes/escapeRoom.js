const express = require('express');
const router = express.Router();
const {getFases} = require("../domain/fase/model");
const {getEvents, getEventsWithDevice} = require("../domain/event/model");
const {sendEventUpdate, sendTimerUpdate} = require("../utils/wsUtils");

let timer = null;

router.post('/play', async (req, res) => {
    try {
        const scenarioId = req.body.scenarioId;
        const speed = 1;

        if (timer) {
            clearInterval(timer.interval);
        }

        const fases = await getFases(scenarioId)
        let events = [];
        let endTime = 0;
        for (const fase of fases) {
            endTime += fase.duration;
            const faseEvents = await getEventsWithDevice(fase.id)
            events.push(faseEvents);
        }

        events = events.flat()

        startTimer(scenarioId, events, speed);

        res.json({message: 'Scenario started', speed: speed})
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})

router.post('/speed', (req, res) => {
    const speed = req.body.speed;
    
    if (!speed || speed <= 0) {
        return res.status(400).json({error: 'Speed must be a positive number'});
    }

    if (timer) {
        const wasRunning = !timer.isPaused;
        
        // Clear current interval
        if (timer.interval) {
            clearInterval(timer.interval);
        }
        
        // Update speed
        timer.speed = speed;

        timer.playingEvents.forEach(event => {
            sendEventUpdate(event, 'speed', true, speed);
        });
        
        // Restart interval with new speed if timer was running
        if (wasRunning) {
            startTimerInterval();
        }
        
        res.json({message: 'Timer speed updated successfully', speed: speed});
    } else {
        res.status(404).json({error: 'No timer currently running'});
    }
});

router.post('/pause', (req, res) => {
    if (timer && !timer.isPaused) {
        clearInterval(timer.interval);
        timer.isPaused = true;

        timer.playingEvents.forEach(event => {
            sendEventUpdate(event, 'pause', false, timer.speed); // Send as stopped/paused
        });

        res.json({message: 'Timer paused successfully'});
    } else if (timer && timer.isPaused) {
        res.status(400).json({error: 'Timer is already paused'});
    } else {
        res.status(404).json({error: 'No timer currently running'});
    }
});

router.post('/resume', (req, res) => {
    if (timer && timer.isPaused) {
        // Simply restart the interval - no time adjustment needed since we track seconds directly
        startTimerInterval();
        timer.isPaused = false;

        timer.playingEvents.forEach(event => {
            sendEventUpdate(event, 'resume', true, timer.speed); // Send as stopped/paused
        });

        res.json({message: 'Timer resumed successfully'});
    } else if (timer && !timer.isPaused) {
        res.status(400).json({error: 'Timer is not paused'});
    } else {
        res.status(404).json({error: 'No timer currently running'});
    }
});

router.post('/stop', (req, res) => {
    if (timer) {
        clearInterval(timer.interval);
        console.log(`Timer stopped for scenario ${timer.scenarioId}`);

        timer.playingEvents.forEach(event => {
            sendEventUpdate(event, 'stop', false, timer.speed); // Send as stopped/paused
        });

        sendTimerUpdate(0);

        timer = null;

        res.json({message: 'Timer stopped successfully'});
    } else {
        res.status(404).json({error: 'No timer currently running'});
    }
});

router.get('/status', (req, res) => {
    if (timer) {
        res.json({
            isPlaying: !timer.isPaused,
            isPaused: timer.isPaused || false,
            scenarioId: timer.scenarioId,
            currentSeconds: timer.currentSeconds,
            speed: timer.speed || 1,
            events: timer.events,
            playingEvents: timer.playingEvents,
            playedEvents: timer.playedEvents,
        });
    } else {
        res.json({isPlaying: false, isPaused: false, speed: 1});
    }
});

function startTimer(scenarioId, events, speed = 1) {
    let currentSeconds = 0;

    // Sort events by starting_seconds for efficient processing
    const sortedEvents = events.sort((a, b) => a.starting_seconds - b.starting_seconds);

    // Set current timer
    timer = {
        interval: null,
        scenarioId,
        currentSeconds,
        events: sortedEvents,
        playingEvents: [],
        playedEvents: [],
        isPaused: false,
        speed: speed
    };

    startTimerInterval();

    console.log(`Timer started for scenario ${scenarioId} at ${speed}x speed`);
}

function startTimerInterval() {
    const intervalDuration = Math.round(1000 / timer.speed);

    const interval = setInterval(() => {
        timer.currentSeconds++;
        sendTimerUpdate(timer.currentSeconds);

        // Stop timer when all events have been processed and none are playing
        if (timer.currentSeconds >= timer.endTime) {
            console.log(`Scenario ${timer.scenarioId} completed - all events played`);
            clearInterval(interval);
            timer = null;
        }

        // Process playing events that should stop
        for (let i = timer.playingEvents.length - 1; i >= 0; i--) {
            const event = timer.playingEvents[i];
            if (event.ending_seconds <= timer.currentSeconds) {
                console.log(`Stopping event: ${JSON.stringify(event)}`);

                // Move event from playingEvents to playedEvents
                timer.playingEvents.splice(i, 1);
                timer.playedEvents.push(event);
                sendEventUpdate(event, 'stop', false, timer.speed);
            }
        }

        // Process events that should start at this second
        for (let i = timer.events.length - 1; i >= 0; i--) {
            const event = timer.events[i];
            if (event.starting_seconds <= timer.currentSeconds) {
                console.log(`Playing event: ${JSON.stringify(event)}`);

                // Move event from events to playingEvents
                timer.events.splice(i, 1);
                timer.playingEvents.push(event);
                sendEventUpdate(event, 'start',true, timer.speed);
            }
        }
    }, intervalDuration);

    timer.interval = interval;
}

module.exports = router;