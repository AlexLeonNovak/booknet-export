import 'dotenv/config'
import { Command } from 'commander/esm.mjs'
import {getCount, getData} from './db.service.js';
import { prepareApiData } from './data.adapter.js';
import { updateBatchContacts } from './mautic.api.js';
import { logger } from './logger.js';
import { clog } from './utils.js'

const program = new Command();
program.option('-s, --source <table>', 'Source table');
program.parse(process.argv);

const { FETCH_LIMIT = 1000, MSSQL_DEFAULT_TABLE } = process.env;

const { source = MSSQL_DEFAULT_TABLE } = program.opts();

const main = async () => {
	try {
		clog('Source data:', source);
		const count = await getCount(source);
		clog('Count:', count);
		const limit = Number(FETCH_LIMIT);
		const pages = Math.ceil(count / limit);
		for (let page = 0; page < pages; page++) {
			clog('Page:', page + 1, 'of pages:', pages);
			clog('Getting data...');
			const data = await getData(source, page * limit, limit);
			clog('Done');
			const preparedData = prepareApiData(data);
			clog('Update mautic contacts... (this can take a few minutes)');
			const result = await updateBatchContacts(preparedData);
			clog('Done');
			logger.log(JSON.stringify(result));
		}
		clog('Finished');
	} catch (e) {
		logger.error(e.message);
		clog('ERROR', e.message);
	}
}
main().catch(console.error);
