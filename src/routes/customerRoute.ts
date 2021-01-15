import { Router } from 'express';
import { customerController } from '../controllers/customerController';

export class customerRoute {
	public customer: customerController = new customerController();
	public Route: Router = Router();

	constructor() {
		this.Route.route('/')
			.post(this.customer.customerData)
			.get(this.customer.returnCustomerData)
			.put(this.customer.updateCustomerData)
			.delete(this.customer.removeCustomerData);

			this.Route.route('/search')
			.get(this.customer.customerSearch)

			this.Route.route('/complaints')
			.post(this.customer.customerComplaints)
			.get(this.customer.getcustomerComplaints)
			.patch(this.customer.updateCustomerComplaints)
			.delete(this.customer.deleteCustomerComplaints)


			this.Route.route('/address')
			.post(this.customer.customerAddressData)
			.patch(this.customer.updateCustomerAddressData)
	}
}
