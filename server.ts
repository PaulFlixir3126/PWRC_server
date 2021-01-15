import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routes from './src/routes/allRoute';
import path from 'path';
import logger from './src/lib/globalLogger';
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swaggerAPI/PWSC.yaml');
import socketController from './src/socket/socket'

import http from 'http';
import { verifying } from './src/lib/tokenVerify';

class App {
	public express: Application;
	public socket: socketController = new socketController();
	// public socket: testController = testController();
	private port = process.env.PORT || 3000;   // our local
	// private port = process.env.PORT || 5001;   // client test server
	// private port = process.env.PORT || 8001;   // client  live server
	public routes: Routes = new Routes();
	public verify = new verifying();
	constructor() {
		// this.socket.deleteuser()
		this.express = express();
		this.express
			.use(cors())
			.use(morgan('dev'))
			.use(bodyParser.json({ limit: '50mb' }))
			.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
			.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
			.set('views', __dirname + '/views')
			.use('/PWSC', express.static(path.join(__dirname, './dist/PWSC')))
			.use('/assets', express.static(path.join(__dirname, './dist/PWSC/assets')))
			// .use(express.static(__dirname + '/data/img'))
			.use(express.static('data/img'))
			.use(express.static(__dirname + '/public'))
			.use(this.verify.tokenVerification)
			.use(async (req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
				res.header('Access-Control-Allow-Headers', 'X-Requested-With');
				res.header('Access-Control-Allow-Headers', 'Content-Type');
				res.header('Access-Control-Allow-Headers', 'token');
				res.header('Access-Control-Max-Age', '3600');
				res.header('Access-Control-Allow-Credentials', 'true');
				next();
			});

		// .listen(this.port, () => logger.info(`server on ${this.port}`));
		const httpServer = http.createServer(this.express);
		this.socket.connectcsocket(httpServer)
		// testController.connectcsocket(httpServer);
		httpServer.listen(this.port, () => logger.info(`server and socket running on ${this.port}`));

		this.routes.routes(this.express);
		
	
		this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
			let { message, body, eCode } = err;

			if (!message) {
				err.message = 'Internal Server Error';
			}

			if (!body) {
				err.body = {};
			}

			err.status = false;
			delete err.eCode;
			res.status(eCode || 500).send(err);
			return logger.error(err);
		});
	}


	
}
export default new App().express;
