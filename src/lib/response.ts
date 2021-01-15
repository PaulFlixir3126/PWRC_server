import { Response } from 'express';

const success = (res: Response, result = {}) => {
	const response = {
		status: true,
		message: 'success',
		type:'ok',
		body: result
	};
	return res.json(response);
};

const invalidRequest = (res: any, result: any) => {
	const response = {
		status: false,
		type: 'invalid request',
		message: result.message,
		data: result.data
	};
	return res.json(response);
};

export { success, invalidRequest };
