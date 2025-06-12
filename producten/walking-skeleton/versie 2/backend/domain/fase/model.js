const {executeQuery} = require("../../utils/dbUtils");
const sql = require("mssql");
const Fase = require("./fase")

async function getFases (scenario_id)  {
    const result = await executeQuery('SELECT * FROM fases WHERE scenario_id = @scenario_id',
        [{ name: 'scenario_id', type: sql.Int, value: scenario_id }]);

    return result.recordset.map(row => new Fase(row.id, row.scenario_id,
        row.name, row.sequence_number, row.location_name,
        row.duration));
}


// Fase is hardcoded because there is not a form to fill in the details of fase
// No return needed because the information is not needed, only for inserting fase into database
async function insertFase (scenario_id, fase = new Fase(null,scenario_id, 'introduction', 1, 'Hallway', 60))  {
    await executeQuery('INSERT INTO fases (scenario_id, name, sequence_number, location_name, duration) VALUES (@scenario_id, @name, @sequence_number, @location_name, @duration)',
        [
            { name: 'scenario_id', type: sql.Int, value: fase.scenario_id },
            {name: 'name', type: sql.VarChar, value: fase.name},
            {name : 'sequence_number', type: sql.Int, value: fase.sequence_number},
            {name: 'location_name', type : sql.VarChar, value: fase.location_name},
            {name: 'duration', type: sql.Int, value: fase.duration}
        ]
    );
}

module.exports = {
    getFases,
    insertFase
}