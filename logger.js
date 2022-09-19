import Database from 'better-sqlite3';

const db = new Database('log.db');

const now = new Date();
const pad = n => n.toString().padStart(2, '0');
const tableName = `log_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}`;


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
