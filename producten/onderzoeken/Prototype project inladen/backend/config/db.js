// backend/config/db.js
const sql = require('mssql');

const dbConfig = {
    server: 'localhost',
    port: 1433,
    user: 'sa',
    password: 'password123!',
    database: 'escaperoom',
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true, // change to false for production
    },
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Error handling
poolConnect.catch(err => {
    console.error('Database connection failed!', err);
});

module.exports = {
    sql,
    pool,
    poolConnect
};