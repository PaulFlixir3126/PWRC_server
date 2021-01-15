import { Router } from 'express';
import { complaintsController } from '../controllers/complaints';

export class complaintsRoute {
	public complaints: complaintsController = new complaintsController();
	public Route: Router = Router();

	constructor() {
		this.Route.route('/')
      .post(this.complaints.savecomplaints)
      .get(this.complaints.getcomplaints)
      .patch(this.complaints.updateComplaints)
			.delete(this.complaints.deleteComplaints);
			
	 this.Route.route('/subcomplaints')
	 .post(this.complaints.postsubcomplaints)
	 .get(this.complaints.getsubcomplaints)
	 .patch(this.complaints.updatesubComplaints)
	 .delete(this.complaints.deletesubComplaints);
	}
}
