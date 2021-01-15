import { Router } from 'express';
import fs from 'fs';
import yaml from 'js-yaml';

export  class swaggerRoute {
	public Route: Router = Router();
	viewOptions = {
		title: 'PWSC Swagger',
		description: 'Home page.',
		datasrc: './swagger/json/source.json'
	};
	inputfile = './swaggerAPI/PWSC.yaml';
	outputfile = './public/swagger/json/source.json';

	constructor() {
		this.Route.get('/', (req, res, next) => {
			/** yaml to json */
			 const swaggerJson = yaml.load(fs.readFileSync(this.inputfile, { encoding: 'utf-8' }));
			 fs.writeFileSync(this.outputfile, JSON.stringify(swaggerJson), 'utf8');
			 res.render('swagger', this.viewOptions);
		});
	}
}


