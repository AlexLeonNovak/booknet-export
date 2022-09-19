import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('log.db');

const now = new Date();
const pad = n => n.toString().padStart(2, '0');
const tableName = `log_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}`;


await db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (
  id INTEGER PRIMARY KEY,
  type VARCHAR(8),
  message MEDIUMTEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);



const insert = async (type, message) => {
	const stmt = await db.prepare(`INSERT INTO ${tableName} (type, message) VALUES ('${type}', '${message}')`);
	return stmt.finalize();
}


export const logger = {
	error: async (msg) => {
		await insert('error', msg);
	},
	log: async (msg) => {
		await insert('log', msg);
	},
}
