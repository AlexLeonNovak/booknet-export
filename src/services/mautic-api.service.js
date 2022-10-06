import axios from 'axios';
import qs from 'qs'

const { API_URL, API_USER, API_PASSWORD } = process.env;

const instance = axios.create({
	baseURL: `${API_URL.replace(/\/$/, '')}/api/`,
	auth: {
		username: API_USER,
		password: API_PASSWORD
	},
	paramsSerializer: params => qs.stringify(params)
});


export const updateBatchContacts = async (data) => {
	const res = await instance.post('contacts/batch/new', data);
	return res.data;
}

export const getAnonymousContacts = async (start = 0, limit = 100) => {
	const res = await instance.get('contacts', {
		params: {
			search: 'is:anonymous',
			start,
			limit,
			order: [
				{
					col: 'id',
					dir: 'ASC',
				}
			],
		}
	});
	return res.data.contacts ? Object.values(res.data.contacts) : [];
}

export const deleteBatchContacts = async (ids) => {
	const res = await instance.delete('contacts/batch/delete', { params: { ids } });
	return res.data;
}
