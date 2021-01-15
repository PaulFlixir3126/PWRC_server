import { Request, Response, NextFunction } from 'express';
import { CustomerTable, sequelize, customerComplaints,complaintTable, Op,subcomplaintTable, CustomerAddressTable } from '../db/database';
import { success } from '../lib/response';
// import * as bcrypt from 'bcrypt'
import {customerDataPOST,updatecustomer,deletecustomer,customercomplaintpost,updatecustomercomplaints,deletecustomercomplaints} from '../validators/customerValidator'
export class customerController {
	async customerData(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await customerDataPOST(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}

			if(req.body.created_from == 'callcenter'){
				// let password = Math.random().toString(36).slice(2)
				// req.body.password = await bcrypt.hash(password, 10);
			}
			const response: any = await CustomerTable.create(<any>req.body);
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while entering customer details',
				body: err.message
			});
		}
	}


	async customerAddressData(req: Request, res: Response, next: NextFunction) {
		try {
			// /** input validations */
			// let validation:any = await customerDataPOST(req);
			// if (!validation.status) {
			// 	let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			// return res.status(validation.code).send(obj);
			// }
			const response: any = await CustomerAddressTable.create(<any>req.body);
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while entering customer address details',
				body: err.message
			});
		}
	}
	async returnCustomerData(req: Request, res: Response, next: NextFunction) {
		try {
			let { phone_no, raw, id }:any = req.query;
			if (raw == 'true') {
				// const response: any = await CustomerTable.findAll({
        //   where: {  [Op.or]: [
				// 		{ phone_no: phone_no },
				// 		{ phone_no2: phone_no},
				// 		{phone_no3: phone_no}
				// 	] },
				// 	include: [
				// 		{model: GlobalAreaTable, attributes:['area_id','area_name_english','area_name_arabic'], 
				// 		include:[{model:BlockTable, attributes:['block_id','area_id', 'block'] }]},
				// 		{model:BlockTable, attributes:['block_id','area_id', 'block']}
				// 	],
				// 	order:[ ['updatedAt', 'DESC'] ]
				// });
				
				const response: any = await CustomerTable.findAll({
            where: {  [Op.or]: [
						{ phone_no: phone_no },
						{ phone_no2: phone_no},
						{phone_no3: phone_no}
					] },
					include: [
						// {model: CustomerAddressTable, include:[{model: GlobalAreaTable},{model: BlockTable}] },
					],
					order:[ ['updatedAt', 'DESC'] ]
        });
				// response.sort((a: any, b: any) => +b.customer_id - +a.customer_id);
				return success(res, response);
			} else {
				if (id) {
					// const response: any = await CustomerTable.findAll({
					// 	where: { customer_id: id },
					// 	include: [
					// 		{model: GlobalAreaTable, attributes:['area_id','area_name_english','area_name_arabic'], 
					// 		include:[{model:BlockTable, attributes:['block_id','area_id', 'block'] }]},
					// 		{model:BlockTable, attributes:['block_id','area_id', 'block']}
					// 	],
					// 	order:[['updatedAt', 'DESC'] ]
					// });

					const response: any = await CustomerTable.findAll({
						where: { customer_id: id },
						include: [
							// {model: CustomerAddressTable, include:[{model: GlobalAreaTable},{model: BlockTable}] },
						],
						order:[['updatedAt', 'DESC'] ]
					});

					return success(res, response);
				}
			}
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while fetching customer data',
				body: err.message
			});
		}
	}

	async updateCustomerData(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await updatecustomer(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}
			
			const response: any = await CustomerTable.update(<any>req.body, {
				where: { customer_id: req.body.customer_id },
				returning: true
			});
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while updating customer data',
				body: err.message
			});
		}
	}

	async updateCustomerAddressData(req: Request, res: Response, next: NextFunction) {
		try {
			// /** input validations */
			// let validation:any = await updatecustomer(req);
			// if (!validation.status) {
			// 	let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			// return res.status(validation.code).send(obj);
			// }
			
			const response: any = await CustomerAddressTable.update(<any>req.body, {
				where: { customer_address_id: req.body.customer_address_id },
				returning: true
			});
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while updating customer address data',
				body: err.message
			});
		}
	}

	async removeCustomerData(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await deletecustomer(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}
			const { id }:any = req.query;
			const response: any = await CustomerTable.destroy({
				where: { customer_id: id }
			});
			return success(res, response);
		} catch (err) {
			next({ status: false,type:'internalServerError', message: 'Internal server error', body: err.message });
		}
	}


	async customerSearch(req:Request,res:Response,next:NextFunction){
    try {
      let serachby=req.query.serachby;
      let keyword=req.query.keyword;
      let s = keyword + "%";
      let query='';
      let response
      if(serachby == 'phone'){
        query=`SELECT * FROM  customercatalogs WHERE lower(phone_no)  LIKE '${s}' or lower(phone_no2)  LIKE '${s}' or lower(phone_no3)  LIKE '${s}'` 
			}
			if(serachby == 'name'){
        query=`SELECT * FROM  customercatalogs WHERE lower(customer_name)  LIKE '${s}' ` 
			}
			if(serachby == 'avenue'){
        query=`SELECT * FROM  customercatalogs WHERE lower(avenue) LIKE '${s}' ` 
			}
			if(serachby == 'street'){
        query=`SELECT * FROM  customercatalogs WHERE lower(street) LIKE '${s}' ` 
			}
			if(serachby == 'building'){
        query=`SELECT * FROM  customercatalogs WHERE lower(building) LIKE '${s}' ` 
			}
			if(serachby == 'floor'){
        query=`SELECT * FROM  customercatalogs WHERE lower(floor)  LIKE '${s}' ` 
			}
			if(serachby == 'flat'){
        query=`SELECT * FROM  customercatalogs WHERE lower(flat) LIKE '${s}' ` 
			}
			if(serachby == 'direction'){
        query=`SELECT * FROM  customercatalogs WHERE lower(direction) LIKE '${s}' ` 
			}
			if(serachby == 'customer_id'){
        query=`SELECT * FROM  customercatalogs WHERE customer_id::text LIKE '${s}' ` 
			}
      response = await sequelize.query(query)
      return success(res, response[0]);
    } catch (error) {
      next({
        status: false,
        type:'internalServerError',
        message: 'Some error occurred while getting search data',
        body: error.message
      });
    }
  }

	async customerComplaints(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await customercomplaintpost(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}
			const response: any = await customerComplaints.bulkCreate(<any>req.body,{returning: true});
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while entering customer complaints',
				body: err.message
			});
		}
	}

	async getcustomerComplaints(req: Request, res: Response, next: NextFunction) {
		try {
			let query:any=req.query
			let wherequery:any={}
			
			if (parseInt(query.filterByOrder)) {
				if((query.order_id == undefined)||(query.order_id == null) || (query.order_id == "")){
					return res.status(400).send({ status: false, type:'invalidRequest', message: 'please pass order_id', data: {} });
				}
				wherequery.order_id = query.order_id;
			}

			if (parseInt(query.filterByCustomer)) {
				if((query.customer_id == undefined)||(query.customer_id == null) || (query.customer_id == "")){
					return res.status(400).send({ status: false, type:'invalidRequest', message: 'please pass customer_id', data: {} });
				}
				wherequery.customer_id = query.customer_id;
			}

			if (parseInt(query.filterByComplaints)) {
				if((query.complaint_id == undefined)||(query.complaint_id == null) || (query.complaint_id == "")){
					return res.status(400).send({ status: false, type:'invalidRequest', message: 'please pass complaint_id', data: {} });
				}
				wherequery.complaint_id = query.complaint_id;
			}

			// if (parseInt(query.filterByBrand)) {
			// 	if((query.brand_id == undefined)||(query.brand_id == null) || (query.brand_id == "")){
			// 		return res.status(400).send({ status: false, type:'invalidRequest', message: 'please pass brand_id', data: {} });
			// 	}
			// 	wherequery.brand_id = query.brand_id;
			// }

			// if (parseInt(query.filterByBranch)) {
			// 	if((query.branch_id == undefined)||(query.branch_id == null) || (query.branch_id == "")){
			// 		return res.status(400).send({ status: false, type:'invalidRequest', message: 'please pass branch_id', data: {} });
			// 	}
			// 	wherequery.branch_id = query.branch_id;
			// }



			if(query.fromdate && query.todate){
			wherequery['createdAt']={[Op.between]: [query.fromdate, query.todate]}
			}
			
			let response :any= await customerComplaints.findAndCountAll({
        where: wherequery,
        include:[{model:CustomerTable},
								//  {model:OrderTable},
								 {model:complaintTable},
								//  {model:subcomplaintTable},
								//  {model:BrandTable},
								//  {model:BranchTable}
							],
				limit : query.limit,
				offset: query.offset,
				order: [['updatedAt', 'DESC']],
			});
			response = JSON.parse(JSON.stringify(response))
        if(response.rows.length >0){
					for(let i=0;i<response.rows.length;i++){
						let subcomplaints:any = await subcomplaintTable.findAll({where:{subcomplaint_id: response.rows[i].subcomplaint_id}})
							response.rows[i]['subcomplaints'] = JSON.parse(JSON.stringify(subcomplaints))
							
					}
				}
      return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while entering customer complaints',
				body: err.message
			});
		}
	}

	async updateCustomerComplaints(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await updatecustomercomplaints(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}
			let response: any
			response = await customerComplaints.update(<any>req.body, {
				where: { complaint_id: req.body.complaint_id, order_id:req.body.order_id },
				returning: true
			});
			if(response[0] == 0 && response[1].length ==0){
				response = await customerComplaints.create(<any>req.body);
			}
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while updating customer complaints',
				body: err.message
			});
		}
	}


	async deleteCustomerComplaints(req: Request, res: Response, next: NextFunction) {
		try {
			/** input validations */
			let validation:any = await deletecustomercomplaints(req);
			if (!validation.status) {
				let obj = { status: false, type:validation.type, message: validation.message, data: validation.data };
			return res.status(validation.code).send(obj);
			}
			const customer_complaint_id:any=req.query.customer_complaint_id
			const response: any = await customerComplaints.destroy({
				where: { customer_complaint_id: customer_complaint_id },
			});
			return success(res, response);
		} catch (err) {
			next({
				status: false,
				type:'internalServerError',
				message: 'Some error occurred while deleting  customer complaints',
				body: err.message
			});
		}
	}


}
