const { pool, sql } = require('../config/db');

/**
 * Execute a SQL query using prepared statements
 * @param {string} query - SQL query with parameter placeholders (@paramName)
 * @param {Array} params - Array of parameter objects [{ name, type, value }]
 * @returns {Promise} - Query results
 */
async function executeQuery(query, params = []) {
  try {
    await pool.connect();
    const request = pool.request();

    // Add parameters to the request with explicit types
    params.forEach(param => {
      request.input(param.name, {type: param.type}, param.value);
    });

    return await request.query(query);
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
}

module.exports = {
  executeQuery,
  sql
};
