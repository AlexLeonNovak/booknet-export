import sqlite3 from 'sqlite3';
import { open } from 'sqlite'
import {DateTime} from 'luxon';

// const db = new sqlite3.Database(
// 	 'log.db',
// 	sqlite3.OPEN_READWRITE,
// 	(err) => {
// 		if (err && err.code !== "SQLITE_CANTOPEN") {
// 			console.error("SQLite error:", err);
// 			process.exit(1);
// 		}
// 	}
// );
const db = await open({
	filename: 'log.db',
	driver: sqlite3.Database
})
const tableName = `log_${DateTime.now().toFormat('yyyy_MM_dd')}`;
const sessId = DateTime.local().toFormat('yyyyMMddHHmmss');

await db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (
  id INTEGER PRIMARY KEY,
  sessId varchar(16),
  type VARCHAR(8),
  message MEDIUMTEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);


const insert = (type, message) =>
	db.exec(`INSERT INTO ${tableName} (sessId, type, message)
             VALUES ('${sessId}', '${type}', '${message}')`);



export const getErrors = async () =>
	await db.all(`SELECT *
                FROM ${tableName}
                WHERE type = 'error'
                  AND sessId = ${sessId}`,
		(err, rows) => promisifyCallback(err, rows)
	);

export const getCountLog = async () =>
	(await db.get(`SELECT COUNT(*) count FROM ${tableName} 
        WHERE type = 'log' AND sessId = ${sessId}`)).count;

export const logger = {
	error: (msg) => insert('error', msg),
	log: (msg) => insert('log', msg),
}
