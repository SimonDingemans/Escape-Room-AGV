import {Droppable} from "../../Droppable.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useEventStore} from "../../../../../store.js";
import {Timeline} from "./Timeline.jsx";

import './timelineContainer.css'

export const TimelineContainer = () => {
    const fase = useEventStore((state) => state.fases).find(fase => fase.active === true);

    const devices = useEventStore((state) => state.devices)
        .filter(device => device.location === fase.location);

    const getDeviceChannelId = useEventStore((state) => state.getDeviceChannelId);

    const [selectedHardware, setSelectedHardware] = useState([]); // default selection
    const dropdownRef = useRef(null);

    const marks = calculateTimeMarks();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleCheckboxChange = (hardware) => {
        setSelectedHardware((prev) => prev.includes(hardware) ? prev.filter((h) => h !== hardware) : [...prev, hardware]);
    };

    return (<div style={{paddingLeft: '10rem', marginRight: '1rem'}}>
        <div className="devices-list">
            {/*Checkboxes for devices*/}
            {devices.map((device) => (<label key={device.hardware} style={{display: 'block', marginBottom: 4}}>
                <input
                    type="checkbox"
                    value={device.hardware}
                    checked={selectedHardware.includes(device.hardware)}
                    onChange={() => handleCheckboxChange(device.hardware)}
                />
                {device.hardware}
            </label>))}
        </div>

        <div>
            {/*Filter devices by selected hardware and render timelines*/}
            <div className="timelines-list">
                {filterDevices(devices, selectedHardware).map(device => {
                    const f = fase.events.map(event => {
                        return {
                            device: event.device,
                            channel: event.device.activeChannel,
                            media: event.media,
                            name: event.name,
                            startingRemainingTime: event.time?.startRemainingTime,
                            endingRemainingTime: event.time?.endRemainingTime
                        }
                    }).filter(event => event.device.hardware === device.hardware)

                    return {
                        hardware: device.hardware, channels: device.channels, events: f

                    }
                }).map((device) => (<div style={{border: '1px solid black'}} key={device.hardware}>
                    {device.channels.map((channel) => {
                        const deviceChannelId = getDeviceChannelId(device, channel)
                        return <Droppable key={channel} id={deviceChannelId}>
                            <Timeline
                                channel={deviceChannelId}
                                marks={marks}
                                channelName={deviceChannelId}
                                events={device.events.filter(event => event.device.activeChannel === channel && event.startingRemainingTime !== undefined && event.endingRemainingTime !== undefined)}
                            />
                        </Droppable>
                    })}
                </div>))}
            </div>
            {/*Render Time marks*/}
            <div className="timeline-marks">
                {marks.map((mark, i) => (<div key={i} className="timeline-mark">
                    {mark}
                </div>))}
            </div>
        </div>
    </div>);


    function calculateTimeMarks() {
        const startingRemainingTime = {
            minutes: fase.time.startRemainingTime.split(':')[0], seconds: fase.time.startRemainingTime.split(':')[1],
        };

        const endingRemainingTime = {
            minutes: fase.time.endRemainingTime.split(':')[0], seconds: fase.time.endRemainingTime.split(':')[1],
        }

        const timeToSeconds = (time) => {
            return parseInt(time.minutes) * 60 + parseInt(time.seconds);
        };

        const duration = timeToSeconds(startingRemainingTime) - timeToSeconds(endingRemainingTime);


        const marks = [];
        const interval = duration / 10;
        const startSeconds = timeToSeconds(endingRemainingTime);

        for (let i = 0; i <= 10; i++) {
            const totalSeconds = startSeconds + (i * interval);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            marks.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

        marks.reverse();

        return marks;
    }

    function filterDevices(devices, selectedHardware) {
        if (selectedHardware.length === 0) return devices;
        return devices.filter(device => selectedHardware.includes(device.hardware));
    }
}