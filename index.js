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

const { FETCH_LIMIT = 100, MSSQL_DEFAULT_TABLE } = process.env;

const { source = MSSQL_DEFAULT_TABLE } = program.opts();

const main = async () => {
		clog('Source data:', source);
		const count = await getCount(source);
		clog('Count:', count);
		const limit = Number(FETCH_LIMIT);
		const pages = Math.ceil(count / limit);
		for (let page = 0; page < pages; page++) {
			clog('Page:', page + 1, 'of pages:', pages);
			clog('Getting data...');
			let data;
			try {
				data = await getData(source, page * limit, limit);
				clog('Done');
			} catch (e) {
				clog('ERROR Message:', e.message);
				clog('ERROR', e);
				logger.error(e.message);
				logger.error(JSON.stringify({ source, page, limit }))
				continue;
			}

			const preparedData = prepareApiData(data);
			clog('Update mautic contacts... (this can take a few minutes)');
			let result;
			try {
				result = await updateBatchContacts(preparedData);
			} catch (e) {
				clog('ERROR Message:', e.message);
				clog('ERROR', e);
				logger.error(e.message);
				logger.error(JSON.stringify({
					lastCustomerIds: preparedData.map(({ customerid }) => customerid)
				}));
				continue;
			}

			if ('contacts' in result) {
				result.contacts.forEach((contact, index) => {
					logger.log(JSON.stringify({
						booknet_customerid: contact.fields.all.customerid,
						mautic_id: contact.id,
						statusCode: result.statusCodes[index]
					}))
				})
			}
			clog('Done');
			// logger.log(JSON.stringify(result));
		}
		clog('Finished');
}
main().catch(console.error);
