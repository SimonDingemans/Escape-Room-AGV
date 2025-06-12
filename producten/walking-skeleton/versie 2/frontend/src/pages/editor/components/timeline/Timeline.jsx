import './Timeline.css';

export const Timeline = ({timeline, marks, events, startSec, endSec}) => {
    const duration = endSec - startSec;
    const {deviceId, channel, deviceChannelId} = timeline

    return (
        <li className="timeline" id={channel}>
            <div className="timeline-channel-name">{deviceChannelId}</div>
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
                        const eventStart = event.starting_seconds;
                        const eventEnd = event.ending_seconds;

                        const width = (eventEnd - eventStart) / duration * 100;
                        const left = ((eventStart - endSec) - (startSec - endSec)) / duration * 100;

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
        </li>
    );

};