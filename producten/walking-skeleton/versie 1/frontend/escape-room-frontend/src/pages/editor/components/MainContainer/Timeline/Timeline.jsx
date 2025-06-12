import './timeline.css'
import React from "react";

function timeToSeconds(timeStr) {
    const [min, sec] = timeStr.split(':').map(Number);
    return min * 60 + sec;
}

export const Timeline = ({channel, marks, channelName, events}) => {
    const startSec = timeToSeconds(marks[marks.length - 1]);
    const endSec = timeToSeconds(marks[0]);
    const duration = endSec - startSec;

    return (
        <div className="timeline" id={channel}>
            <div className="timeline-channel-name">{channelName}</div>
            <div className="timeline-bar-wrapper">
                <div className="timeline-bar">
                    {marks.map((mark, i) => (
                        <div
                            key={i}
                            className="timeline-bar-segment"
                            style={{ left: `${(i / (marks.length - 1)) * 100}%` }}
                        />
                    ))}

                    {/* Render Event boxes */}
                    {events.map((event, idx) => {
                        const eventStart = timeToSeconds(event.startingRemainingTime);
                        const eventEnd = timeToSeconds(event.endingRemainingTime);

                        // Width is the percentage of the duration of the Fase
                        const width = (eventStart - eventEnd) / duration * 100;

                        // Calculate left position as percentage from start
                        const left = 100 - ((eventStart - endSec) - (startSec - endSec)) / duration * 100;

                        return (
                            <div
                                key={idx}
                                className="timeline-event-box"
                                style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    backgroundColor: 'green',
                                    position: 'absolute'
                                }}
                                title={event.name}
                            >
                                <span className="timeline-event-label">
                                    {event.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

};