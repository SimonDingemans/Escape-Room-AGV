const {executeQuery, sql} = require("../../utils/dbUtils");
const {Device} = require("./device");


async function getDevicesFromDatabase() {
    const result = await executeQuery('SELECT * FROM devices');
    return result.recordset.map(row =>
        new Device(row.id, row.name, row.location_name, row.nickname))

}

// Hardcoded location and nickname because it is not relevant
async function insertDevices(json) {
    const currentDevices = await getCurrentDevices();

    for (const device of json) {
        const index = json.indexOf(device);
        try {
            let name

            if (device?.dir === 'output') {
                name = device.name
            } else if ('index' in device) {
                name = device.index
            } else continue;

            if (currentDevices === [] || !currentDevices.some(d => d.name === name)) {
                // Upload the event to the database
                await executeQuery(`
                    INSERT INTO devices (name, location_name, nickname)
                    VALUES (@name, 'Hallway', @nickname);
                `, [
                    {name: 'name', type: sql.VarChar, value: name},
                    {name: 'nickname', type: sql.VarChar, value: device.dir ? 'AUDIO ' + index : 'DISPLAY ' + index}
                ]);
            }
        } catch (e) {
            // Ignore error and continue to next device
            console.error(e)
        }
    }
}

async function getCurrentDevices() {
    const result = await executeQuery('SELECT * FROM devices');
    return result.recordset.flatMap(row => new Device(row.id, row.name, row.location_name, row.nickname)) || [];
}


module.exports = {
    insertDevices,
    getDevicesFromDatabase,
}