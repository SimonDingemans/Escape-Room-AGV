import {DndContext} from "@dnd-kit/core";
import {Sidebar} from "./components/Sidebar.jsx";
import {EventForm} from "./components/eventform/EventForm.jsx";
import {useEffect, useState} from "react";
import {useScenarioStore} from "../../stores/scenarioStore.js";
import {Timeline} from "./components/timeline/Timeline.jsx";
import {Droppable} from "./components/Droppable.jsx";
import {useWsStore} from "../../stores/wsStore.js";

export const Editor = () => {
    const connect = useWsStore(state => state.connect);
    const disconnect = useWsStore(state => state.disconnect);
    const [showForm, setShowForm] = useState(null);
    const fases = useScenarioStore(state => state.fases)
    let fase = fases.find(fase => fase.editing === true);
    if (!fase) {
        fase = fases[0]
        fases[0].editing = true;
    }
    const getTimings = useScenarioStore(state => state.getTimingsOfFase);
    const {startingTime, endingTime} = getTimings(fase.id);
    const unfilteredEvents = useScenarioStore(state => state.events)
    const events = unfilteredEvents.filter(event => event.fase_id === fase.id);
    const getFaseDeviceChannels = useScenarioStore(state => state.getFaseDeviceChannels);
    const timelines = getFaseDeviceChannels();

    useEffect(() => {
        connect('EDITOR');

        return () => disconnect();
    }, [])

    let marks = [];
    const duration = fase.duration;
    const interval = duration / 10;

    for (let i = 0; i <= 10; i++) {
        const totalSeconds = startingTime + (i * interval);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        marks.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    function handleDragEnd(event) {
        const {active, over} = event;

        if (!over) return;

        const device = over.id.split(':')[0]
        const channel = over.id.split(':')[1]

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        timelines.filter(timeline => timeline.deviceChannelId === over.id)
            .forEach(timeline => {
                setShowForm({
                    media: active.id,
                    fase: fase.name,
                    device: {name: device, id: timeline.deviceId},
                    channel: channel
                });
            })
    }

    return <main style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <DndContext onDragEnd={handleDragEnd}>
            <Sidebar/>
            {showForm ? <EventForm showForm={showForm} onSubmit={setShowForm}/> :
                <ul style={{listStyle: 'none', width: '100%', paddingLeft: '10rem'}}>
                    {timelines.map(timeline => {
                        const timelineEvents = events.filter(event => event.device_id === timeline.deviceId && event.channel === timeline.channel);
                        return <Droppable id={timeline.deviceChannelId} key={timeline.deviceChannelId}>
                            <Timeline key={timeline.deviceChannelId} timeline={timeline} marks={marks}
                                      events={timelineEvents} startSec={startingTime} endSec={endingTime}/>
                        </Droppable>
                    })}
                    <li className="timeline-marks">
                        {marks.map((mark, i) => (<div key={i} className="timeline-mark">
                            {mark}
                        </div>))}
                    </li>
                </ul>}
        </DndContext>
    </main>
}