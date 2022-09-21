import sqlite3 from 'sqlite3';
import {DateTime} from 'luxon';

const db = new sqlite3.Database('log.db');
const tableName = `log_${DateTime.now().toFormat('yyyy_MM_dd')}`;

db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (
  id INTEGER PRIMARY KEY,
  type VARCHAR(8),
  message MEDIUMTEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);



const insert = (type, message) => {
	db.exec(`INSERT INTO ${tableName} (type, message) VALUES ('${type}', '${message}')`);
}


export const logger = {
	error: (msg) => insert('error', msg),
	log: (msg) => insert('log', msg),
}
