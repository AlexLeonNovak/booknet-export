import {getCountLog, getErrors} from './logger.js';
import {sendMail} from '../services/smtp.service.js';


export const sendReport = async () => {
	const logCount = await getCountLog();
	const errors = await getErrors();

	const html = `
	<h1>Export data finished</h1>
	<p><strong>Processed count: </strong>${logCount + errors.length}</p>
	<p><strong>Success count: </strong>${logCount}</p>
	<p><strong>Error count: </strong>${errors.length}</p>
	${errors.length && `
			<h3>Error list</h3>
			<table>
			<thead>
				<tr>
		      <th>Date</th>
		      <th>Message</th>
		    </tr>
			</thead>
			<tbody>
			${errors.map(error => {
				let message;
				try {
					const info = JSON.parse(error.message);
					if ('booknetCustomerId' in info) {
						message = `
							<p><strong>CustomerId: </strong>${info.booknetCustomerId}</p>
							<p><strong>Status code: </strong>${info.statusCode}</p>
							<p><strong>errors: </strong>${info.errors.map(e => `Messages: ${e.errorMessages.join(', ')} Value: ${e.booknetValue}`)}</p>
						`;
					} else {
						message = error.message;
					}
				} catch (e) {
					message = error.message;
				}
				return `<tr><td>${error.createdAt}</td><td>${message}</td></tr>`;
			})}
			</tbody>
			</table>
		`}
	`;

	return await sendMail(html);
}
