import { DateTime } from 'luxon';
export const clog = (...message) => console.log(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'), ...message);

export const arrayChunk = (array, chunkSize = 1) => {
	if (chunkSize < 1) {
		throw new Error('Chunk size must be greater then 0');
	}
	if (chunkSize === 1) {
		return [[...array]];
	}
	const chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		chunks.push(chunk);
	}
	return chunks;
}
