const {executeQuery, sql} = require("../../utils/dbUtils");
const Event = require("./event")

async function getEvents(fase_id){
    const result = await executeQuery('SELECT * FROM events where fase_id = @fase_id',
        [{name: 'fase_id', type: sql.Int, value: fase_id}])

    return result.recordset.map(row => new Event(row.id, row.fase_id, row.name,
        row.file_name, row.device_id, row.channel, row.synchronized,
        row.type, row.media, row.starting_seconds, row.ending_seconds));

}

async function getEventsWithDevice(fase_id) {
    const result = await executeQuery('SELECT e.*, d.name as device_name FROM events e JOIN devices d ON e.device_id = d.id where fase_id = @fase_id',
        [{name: 'fase_id', type: sql.Int, value: fase_id}])

    return result.recordset.map(row => {
        const event = new Event(row.id, row.fase_id, row.name,
            row.file_name, row.device_id, row.channel, row.synchronized,
            row.type, row.media, row.starting_seconds, row.ending_seconds)

        event.device = row.device_name;

        return event;
    });
}


async function insertEvent(event) {
    const result = await executeQuery(
        `
                INSERT INTO events (fase_id, name, file_name, device_id, channel, synchronized, type, media,
                                    starting_seconds, ending_seconds) 
                OUTPUT INSERTED.*
                VALUES (@fase_id, @name, @file_name, @device_id, @channel, 0, @type, @media, @starting_seconds,
                        @ending_seconds)
            `,
        [
            {name: 'fase_id', type: sql.Int, value: event.fase_id},
            {name: 'name', type: sql.VarChar, value: event.name},
            {name: 'file_name', type: sql.VarChar, value: event.file_name},
            {name: 'device_id', type: sql.TinyInt, value: event.device_id},
            {name: 'channel', type: sql.TinyInt, value: event.channel},
            {name: 'type', type: sql.VarChar, value: event.type},
            {name: 'media', type: sql.VarChar, value: event.media},
            {name: 'starting_seconds', type: sql.SmallInt, value: event.starting_seconds},
            {name: 'ending_seconds', type: sql.SmallInt, value: event.ending_seconds}
        ]);

        return result.recordset.map(row => new Event(row.id, row.fase_id, row.name,
            row.file_name, row.device_id, row.channel, row.synchronized,
                row.type, row.media, row.starting_seconds, row.ending_seconds));
}

module.exports = {
    insertEvent,
    getEvents,
    getEventsWithDevice,
}
