import { Router } from 'express';
import { scriptController } from '../controllers/scripts';

export class scriptRoute {
	public script: scriptController = new scriptController();
	public Route: Router = Router();

	constructor() {
		this.Route.route('/extracoumn').get(this.script.createExtraColumnforExistingTable);
		this.Route.route('/unitpriceUpdates').get(this.script.updateUnitPrice);
		this.Route.route('/deletefulltable').get(this.script.deleteFullTable);
	}
}
