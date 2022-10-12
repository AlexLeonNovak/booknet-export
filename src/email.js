import 'dotenv/config'
import {sendMail} from './services/smtp.service.js';

const main = async () => {
	const html = `
	<p>Test message</p>
	`
	await sendMail(html);
}

main().catch(console.error)
