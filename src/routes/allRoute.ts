import { Application } from 'express';
import { swaggerRoute } from './swagger';
import { sequelize } from '../db/database';
import { success } from '../lib/response';
import { customerRoute } from './customerRoute';
import {scriptRoute} from './scriptRoute';
import {complaintsRoute} from './complaintsRoute';

export default class routes {

	public swaggerRoute = new swaggerRoute().Route;
	public customerRoute = new customerRoute().Route;
	public script = new scriptRoute().Route;
	public complaints = new complaintsRoute().Route;

	public routes(app: Application): void {
		app.use('/', this.swaggerRoute);
		app.use('/customers', this.customerRoute);
		app.use('/scripts',this.script);
		app.use('/complaints',this.complaints);
		app.use('/db', async (req, res, next) => {
			try {
				// await sequelize.drop();
				success(res, 'its not valid');
			} catch (err) {
				next({ body: err });
			}
		});
	}
}
