import React, {useEffect} from "react";
import {DndContext} from "@dnd-kit/core";

import './Editor.css'
import {useEventStore} from "../../store.js";
import {Sidebar} from "./components/Sidebar/Sidebar.jsx";
import {EventForm} from "./components/MainContainer/EventForm/EventForm.jsx";
import {TimelineContainer} from "./components/MainContainer/Timeline/TimelineContainer.jsx";
import {useWsStore} from "../../ws.js";

export const Editor = () => {
    const fase = useEventStore((state) => state.fases).find(fase => fase.active === true);
    const eventForm = useEventStore((state) => state.eventForm);
    const devices = useEventStore((state) => state.devices)
        .filter(device => device.location === fase.location);
    const getDeviceChannelId = useEventStore((state) => state.getDeviceChannelId);
    const showEventForm = useEventStore((state) => state.showEventForm);
    const timelines = devices.flatMap(device => device.channels.map(channel => getDeviceChannelId(device, channel)));

    const connect = useWsStore(state => state.connect);
    const disconnect = useWsStore(state => state.disconnect);

    useEffect(() => {
        const connectToServer = async () => {
            disconnect()
            connect('EDITOR');
        };

        // noinspection JSIgnoredPromiseFromCall
        connectToServer();
    }, []);


    return (<div className={'editor'}>
        <DndContext onDragEnd={handleDragEnd}>
            <Sidebar />
            <div className="container">
                {eventForm ? <EventForm/> : <TimelineContainer/>}
            </div>
        </DndContext>
    </div>);

    function handleDragEnd(event) {
        const {active, over} = event;

        const device = over.id.split(':')[0]
        const channel = over.id.split(':')[1]

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        if (timelines.includes(over.id)) {
            showEventForm({media: active.id, fase: fase.name, device: device, channel: channel});
        }
    }
}