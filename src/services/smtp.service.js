import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT,  SMTP_SECURE = false, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_TO, SMTP_SUBJECT } = process.env;

export const sendMail = async (htmlContent) => {
	const transport = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_SECURE === 'true', // use SSL - TLS
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASSWORD,
		},
	});
	return await transport.sendMail({
		from: SMTP_FROM,
		to: SMTP_TO,
		subject: SMTP_SUBJECT,
		html: htmlContent,
	});
};
