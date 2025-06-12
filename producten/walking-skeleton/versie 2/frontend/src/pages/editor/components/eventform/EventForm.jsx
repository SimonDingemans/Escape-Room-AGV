import './EventForm.css';
import {Event} from '../../../../dataModel.js'
import {useScenarioStore} from "../../../../stores/scenarioStore.js";

export const EventForm = ({showForm, onSubmit}) => {
    const addEvent = useScenarioStore(state => state.addEvent);

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
            <input name='device' defaultValue={showForm.device.name}/>
        </label>
        <input name='deviceId' defaultValue={showForm.device.id} hidden/>
        <label>
            Channel
            <input name='channel' defaultValue={showForm.channel}/>
        </label>
        <label>
            Event type
            <input name='eventType' defaultValue={'TIMEBOUND'}/>
        </label>
        <label>
            Media type
            <select name='media' defaultValue={showForm.media}>
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
        <div>
            <button type='button' onClick={(e) => {
                e.preventDefault()
                onSubmit(null)
            }}>Cancel
            </button>
            <button type='submit'>Submit</button>
        </div>
    </form>

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startingSeconds = parseInt(formData.get('startingMinutes') || 0) * 60 + parseInt(formData.get('startingSeconds') || 0);
        const endingSeconds = parseInt(formData.get('endingMinutes') || 0) * 60 + parseInt(formData.get('endingSeconds') || 0);

        const requestFormData = new FormData();
        const uploadedFile = formData.get('file');
        requestFormData.append('file', uploadedFile);

        const data = new Event(0, parseInt(formData.get('fase')), formData.get('name'), uploadedFile.name, parseInt(formData.get('deviceId')), parseInt(formData.get('channel')), 0, formData.get('eventType'), formData.get('media'), startingSeconds, endingSeconds);

        Object.entries(data).forEach(([key, value]) => {
            requestFormData.append(key, value);
        });

        await fetch('http://localhost:8080/event/upload', {
            method: 'POST', body: requestFormData
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                data.id = res.event.id;
                addEvent(data)
            })
            .catch(err => {
                console.log(err);
            })

        onSubmit();
    }
}