import './eventForm.css'
import {useEventStore} from "../../../../../store.js";
import {useRef} from "react";
import {TimeboundEvent, Device, Time} from "../../../../../data-structure.js";
import {useWsStore} from "../../../../../ws.js";

export const EventForm = () => {
    const eventForm = useEventStore((state) => state.eventForm);
    const addEvent = useEventStore((state) => state.addEvent)
    const hideEventForm = useEventStore((state) => state.hideEventForm);
    const devices = useEventStore((state) => state.devices)
    const sendMessage = useWsStore(state => state.sendMessage);
    const sendFile = useWsStore(state => state.sendFile);

    const {media, fase, device, channel} = eventForm;

    const fileInputRef = useRef(null);
    const typeSelectRef = useRef(null);

    return <form className={'event-form'} onSubmit={(e) => handleSubmit(e)}>
        <input id={'Device'} name={'Device'} defaultValue={device} readOnly/>
        <input id={'channel'} name={'channel'} defaultValue={channel} readOnly/>
        <select id={'media'} name={'media'} defaultValue={media}>
            <option value={'AUDIO'}>Audio</option>
            <option value={'VIDEO'}>Video</option>
            <option value={'LIGHT'}>Light</option>
        </select>
        <input id={'name'} name={'name'} defaultValue={'New Function'}/>

        {/* Starting Time (mm:ss) */}
        <div className="time-input-group">
            <label htmlFor="startMin">Start Remaining Time:</label>
            <input
                type="number"
                id="startMin"
                name="startMin"
                min="0"
                max="59"
                placeholder="MM"
                style={{width: "3em"}}
            />:
            <input
                type="number"
                id="startSec"
                name="startSec"
                min="0"
                placeholder="SS"
                style={{width: "3em"}}
            />
        </div>

        {/* Ending Time (mm:ss) */}
        <div className="time-input-group">
            <label htmlFor="endMin">End Remaining Time:</label>
            <input
                type="number"
                id="endMin"
                name="endMin"
                min="0"
                placeholder="MM"
                style={{width: "3em"}}
            />:
            <input
                type="number"
                id="endSec"
                name="endSec"
                min="0"
                max="59"
                placeholder="SS"
                style={{width: "3em"}}
            />
        </div>

        <input name='file' type="file" id="file" ref={fileInputRef}/>
        <select name='type' id="type" defaultValue={'movie'} ref={typeSelectRef}>
            <option value="movie">Movie</option>
            <option value="audio">Audio</option>
        </select>

        <div>
            <button type={'submit'}>Add</button>
            <button onClick={() => hideEventForm()}>Cancel</button>
        </div>
    </form>

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const fileType = formData.get('type');
        const file = formData.get('file');

        const event = new TimeboundEvent(
            file.name,
            formData.get('media'),
            formData.get('name'),
            devices.filter(device => device.hardware === formData.get('Device')).map(d => new Device(d.hardware, d.channels, d.location, formData.get('channel')))[0],
            new Time(formData.get('startMin') + ':' + formData.get('startSec'), formData.get('endMin') + ':' + formData.get('endSec')),
        )

        addEvent(fase, event)
        sendMessage(JSON.stringify({type: 'message', receiver: "TOUCH_DESIGNER", message: {fase: fase, event: event}}))

        if (file && fileType) {
            sendFile(fileInputRef.current, typeSelectRef.current)
        }
    }
}