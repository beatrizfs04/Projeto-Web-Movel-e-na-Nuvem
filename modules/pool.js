const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10, 
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'project'
});

pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    console.error('Reconnecting due to lost connection:', err);
  }
});

module.exports = pool;
