import './EventForm.css';

export const EventForm = ({device}) => {
    return <form className={'event-form'} onSubmit={(e) => handleSubmit(e)}>
        <label>
            Fase
            <input name='fase' defaultValue={1}/>
        </label>
        <label>
            Naam
            <input name='name' defaultValue={'Event'}/>
        </label>
        <label>
            Device
            <input name='device' defaultValue={device.name}/>
        </label>
        <input name='deviceId' defaultValue={device.id} hidden/>
        <label>
            Channel
            <input name='channel' defaultValue={device.channel}/>
        </label>
        <label>
            Event type
            <input name='eventType' defaultValue={'TIMEBOUND'}/>
        </label>
        <label>
            Media type
            <select name='media'>
                <option value='MOVIE'>Video</option>
                <option value='AUDIO'>Audio</option>
                <option value='LIGHT'>Light</option>
            </select>
        </label>
            <input name='file' type="file"/>
        <div>
            Starting time
            <input name='startingMinutes' placeholder={'mm'}/>
            <input name='startingSeconds' placeholder={'ss'}/>
        </div>
        <div>
            Ending time
            <input name='endingMinutes' placeholder={'mm'}/>
            <input name='endingSeconds' placeholder={'ss'}/>
        </div>
        <button type='submit'>Submit</button>
    </form>

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startingSeconds = parseInt(formData.get('startingMinutes') || 0) * 60 + parseInt(formData.get('startingSeconds') || 0);
        const endingSeconds = parseInt(formData.get('endingMinutes') || 0) * 60 + parseInt(formData.get('endingSeconds') || 0);

        const data = {
            faseId: parseInt(formData.get('fase')),
            name: formData.get('name'),
            deviceId: parseInt(formData.get('deviceId')),
            channel: parseInt(formData.get('channel')),
            type: formData.get('eventType'),
            mediaType: formData.get('media'),
            startingSeconds: startingSeconds,
            endingSeconds: endingSeconds
        };

        const requestFormData = new FormData();
        requestFormData.append('file', formData.get('file'));
        Object.entries(data).forEach(([key, value]) => {
            requestFormData.append(key, value);
        });

        fetch('http://localhost:8080/event/upload', {
            method: 'POST',
            body: requestFormData
        });

    }
}