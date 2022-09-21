import 'dotenv/config'
import { Command } from 'commander/esm.mjs'
import {getCount, getData} from './db.service.js';
import { prepareApiData } from './data.adapter.js';
import { updateBatchContacts } from './mautic.api.js';
import { logger } from './logger.js';
import { clog } from './utils.js'

const program = new Command();
program.option('-s, --source <table>', 'Source table');
program.option('-p, --page <pageNumber>', 'Start from page');
program.parse(process.argv);

const { FETCH_LIMIT = 100, MSSQL_DEFAULT_TABLE } = process.env;

const { source = MSSQL_DEFAULT_TABLE, page = 1 } = program.opts();

const main = async () => {
		clog('Source data:', source);
		const count = await getCount(source);
		clog('Count:', count);
		const limit = Number(FETCH_LIMIT);
		const pages = Math.ceil(count / limit);
		for (let p = page - 1; p < pages; p++) {
			clog('Page:', p + 1, 'of pages:', pages);
			clog('Getting data...');
			let data;
			try {
				data = await getData(source, p * limit, limit);
				clog('Done');
			} catch (e) {
				clog('ERROR Message:', e.message);
				clog('ERROR', e);
				logger.error(e.message);
				logger.error(JSON.stringify({ source, page: p, limit }))
				continue;
			}

			const preparedData = prepareApiData(data);
			clog('Update mautic contacts... (this can take a few seconds)');
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

			if ('statusCodes' in result) {
				result.statusCodes.forEach((code, index) => {
					const logResult = {
						booknetCustomerId: preparedData[index].customerid,
						statusCode: code
					};
					if ([200, 201].includes(code)) {
						logResult.mauticId = result.contacts[index].id;
					} else if ('errors' in result) {
						const errors = [];
						for (const field in result.errors[index].details) {
							errors.push({
								errorMessages: result.errors[index].details[field],
								booknetValue: preparedData[index][field],
							})
						}
						logResult.errors = errors;
					}
					'errors' in logResult ? logger.error(JSON.stringify(logResult)) : logger.log(JSON.stringify(logResult));
				});
			}

			clog('Done');
			// logger.log(JSON.stringify(result));
		}
		clog('Finished');
}
main().catch(console.error);
