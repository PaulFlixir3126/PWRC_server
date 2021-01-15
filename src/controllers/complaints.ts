import { Request, Response, NextFunction } from "express";
import {complaintTable,Sequelize,sequelize, subcomplaintTable, customerComplaints,Op} from "../db/database";
import { success } from "../lib/response";

export class complaintsController {
  async savecomplaints(req: Request, res: Response, next: NextFunction) {
    try {
      let response: any;
      response = await complaintTable.create(req.body, {
        returning: true
      });
      return success(res, response);
    } catch (error) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while adding complaints ",
        body: error.message
      });
    }
  }

  async postsubcomplaints(req: Request, res: Response, next: NextFunction) {
    try {
      let response: any;
      response = await subcomplaintTable.create(req.body, {
        returning: true
      });
      return success(res, response);
    } catch (error) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while adding complaints ",
        body: error.message
      });
    }
  }
  


  async getcomplaints(req:Request,res:Response,next: NextFunction){
    try {
      let response: any;
      let query:any={}
      if(req.query.complaint_id){
        query.complaint_id=req.query.complaint_id
      }
      response = await complaintTable.findAll({
        where:query
      });
      return success(res, response);
    } catch (error) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while getting complaints ",
        body: error.message
      });
    }
  }

  async getsubcomplaints(req:Request,res:Response,next: NextFunction){
    try {
      let response: any;
      let query:any={}
      if(req.query.complaint_id){
        query.complaint_id=req.query.complaint_id
      }

      if(req.query.subcomplaint_id){
        query.subcomplaint_id=req.query.subcomplaint_id
      }
      response = await subcomplaintTable.findAll({
        where:query,
        include:[
          {model:complaintTable},
       ]
      });

      
      return success(res, response);
    } catch (error) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while getting subcomplaints ",
        body: error.message
      });
    }
  }


  async updateComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      const response: any = await complaintTable.update(req.body, {
				where: {complaint_id:req.body.complaint_id},
				returning: true
      });
      return success(res, response);
    } catch (err) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while updating complaints",
        body: err.message
      });
    }
  }


  async updatesubComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      const response: any = await subcomplaintTable.update(req.body, {
				where: {subcomplaint_id:req.body.subcomplaint_id},
				returning: true
      });
      return success(res, response);
    } catch (err) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while updating subcomplaints",
        body: err.message
      });
    }
  }


  async deleteComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      let complaint_id:any=req.query.complaint_id
      const complaintresponse: any = await complaintTable.findAll({
				where: {complaint_id:complaint_id}
      });
      if(complaintresponse.length > 0){
        let message='you cant delete this, its already added in customer complaints'
       	return res.status(500).send({ status: false, type:'conflict', message: message, data: [] });
      }
      const response: any = await complaintTable.destroy({
				where: {complaint_id:complaint_id}
      });
      return success(res, response);
    } catch (err) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while deleting complaints",
        body: err.message
      });
    }
  }


  async deletesubComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      let subcomplaint_id:any=req.query.subcomplaint_id
      const response: any = await customerComplaints.findAll({
        where: { subcomplaint_id: {
          [Op.contains]: [subcomplaint_id]
        }}
      });

      if(response.length > 0){
        let message='you cant delete this, its already added in customer complaints'
       	return res.status(500).send({ status: false, type:'conflict', message: message, data: [] });
      }
      const subcomplaintresponse: any = await subcomplaintTable.destroy({
				where: {subcomplaint_id:subcomplaint_id}
      });
      return success(res, subcomplaintresponse);
    } catch (err) {
      next({
        status: false,
        type:'internalServerError',
        message: "Some error occurred while deleting subcomplaints",
        body: err.message
      });
    }
  }

}
