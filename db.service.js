import mssql from 'mssql';

const { MSSQL_SERVER, MSSQL_DATABASE, MSSQL_USER,	MSSQL_PASSWORD } = process.env;

const config = {
	user: MSSQL_USER,
	password: MSSQL_PASSWORD,
	server: MSSQL_SERVER,
	database: MSSQL_DATABASE,
	options: {
		trustServerCertificate: true,
	},
}

export const getData = async (tableName, offset = 0, limit = 1000) => {
	const sql = `SELECT * FROM dbo.${tableName} 
     ORDER BY Customer_Id
      OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY;`;
	const connection = await mssql.connect(config);
	const { recordset } = await connection.request().query(sql);
	return recordset;
}

export const getCount = async (tableName) => {
	const sql = `SELECT COUNT(*) c FROM dbo.${tableName}`;
	const connection = await mssql.connect(config);
	const { recordset } = await connection.request().query(sql);
	return recordset[0].c;
}

process.on('exit', async () => {
	const connection = await mssql.connect(config);
	await connection.close();
})
