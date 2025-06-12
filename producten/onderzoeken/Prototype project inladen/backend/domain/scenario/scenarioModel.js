const {executeQuery} = require("../../utils/dbUtils");
const sql = require('mssql');
const Scenario = require("./scenario");

async function getScenario (id)  {
    const result = await executeQuery('SELECT * FROM scenarios WHERE id = @id',
        [{ name: 'id', type: sql.Int, value: id }]);

    return result.recordset.map(row => new Scenario(row.id, row.name));
}

async function insertScenario (scenario) {
    const result = await executeQuery('INSERT INTO scenarios (name) OUTPUT INSERTED.* VALUES (@name)',
        [{name: 'name', type: sql.VarChar, value : scenario.name }]);

    return result.recordset.map(row => new Scenario(row.id, row.name));
}

module.exports = { getScenario, insertScenario };
