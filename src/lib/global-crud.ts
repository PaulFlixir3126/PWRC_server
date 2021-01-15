import { Response, NextFunction } from 'express';
import { success } from './response';
const gCreate = async (payload: any = {}, model: any, res: Response, next: NextFunction) => {
	try {
		const response: any = await model.create(payload);
		return success(res, response);
	} catch (err) {
		next({ body: err });
	}
};

const gDelete = async (
	reqQuery: any = {},
	key: any,
	model: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = reqQuery;
		let response: any,
			query = {};

		if (id) {
			query = { where: { [key]: id } };
			response = await model.destroy(query);
			return success(res, response);
		}

		query = { where: {}, truncate: true };
		response = await model.destroy(query);
		return success(res, response);
	} catch (err) {
		next({ body: err });
	}
};

const gUpdate = async (
	payload: any = {},
	key: any,
	model: any,
	res: Response,
	next: NextFunction,
	quit = false
) => {
	try {
		const response: any = await model.update(payload, {
			where: { [key]: payload[key] },
			returning: true
		});

		if (quit) {
			return;
		}

		return success(res, response);
	} catch (err) {
		next({ body: err });
	}
};

const gReturn = async (key = {}, model: any, res: Response, next: NextFunction, quit = false) => {
	try {
		const response: any = await model.findAll(key);
		if (quit) {
			return response;
		}
		return success(res, response);
	} catch (err) {
		next({ body: err });
	}
};

export { gCreate, gDelete, gUpdate, gReturn };
