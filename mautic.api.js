import axios from 'axios';

const { API_URL, API_USER, API_PASSWORD } = process.env;

const instance = axios.create({
	baseURL: `${API_URL.replace(/\/$/, '')}/api/`,
	auth: {
		username: API_USER,
		password: API_PASSWORD
	},
});


export const updateBatchContacts = async (data) => {
	const res = await instance.put('contacts/batch/edit', data);
	return res.data;
}
