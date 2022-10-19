import 'dotenv/config'
import { deleteBatchContacts, getAnonymousContacts } from './services/mautic-api.service.js';
import {arrayChunk, clog} from './utils/utils.js';

const main = async () => {
	clog('Starting clean contacts');
	let contactIds = [];
	let contacts = [];
	let start = 0;
	try {
		do {
			clog('Fetching anonymous contacts...');
			contacts = await getAnonymousContacts(start);
			clog('Done, count contacts:', contacts.length);
			const ids = contacts.filter(contact => {
				const {customerid, firstname} = contact.fields.all;
				return !customerid && !firstname;
			}).map(({id}) => id);
			clog('Count ids:', ids.length);
			if (ids.length) {
				start = start + ids.length;
			}
			contactIds = [...contactIds, ...ids];
			if (contactIds.length >= 10000) {
				break;
			}
		} while (contacts.length);

		if (contactIds.length) {
			clog('Delete contacts');
			const chunkIds = arrayChunk(contactIds, 100);
			let part = 1;
			for (const ids of chunkIds) {
				clog('Delete part', part++, 'of', chunkIds.length);
				await deleteBatchContacts(ids);
			}
		}
	} catch (e){
		clog('ERROR:', e.message);
	}
	clog('Finished');
}
main().catch(console.error);
