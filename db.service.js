import mssql from 'mssql';

const { MSSQL_SERVER, MSSQL_DATABASE, MSSQL_USER,	MSSQL_PASSWORD, MSSQL_DEFAULT_TABLE} = process.env;

const connection = await mssql.connect({
	user: MSSQL_USER,
	password: MSSQL_PASSWORD,
	server: MSSQL_SERVER,
	database: MSSQL_DATABASE,
	options: {
		trustServerCertificate: true,
	},
});


export const getData = async (tableName = MSSQL_DEFAULT_TABLE, offset = 0, limit = 1000) => {
	const sql = `SELECT * FROM dbo.${tableName} 
     ORDER BY Customer_Id
      OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY;`;
	const { recordset } = await connection.request().query(sql);
	return recordset;
}

export const getCount = async (tableName = MSSQL_DEFAULT_TABLE) => {
	const sql = `SELECT COUNT(*) c FROM dbo.${tableName}`;
	const { recordset } = await connection.request().query(sql);
	return recordset[0].c;
}

process.on('exit', () => {
	connection.close();
})
