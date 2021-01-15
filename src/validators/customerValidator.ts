import {
  checkIsObjectAndNotEmpty,
  checkIsArrayAndNotEmpty,
  checkIsSet,
  checkIsInputObjectContainsUnknownKeys,
  includesIn,
  checkall
} from "../validators/genericValidator";
import logger from "../lib/logger";
import {
  CustomerTable,
  Op,
  complaintTable,customerComplaints
} from "../db/database";
let arr = ["phone_no", "customer_name"];

const customerDataPOST = async (req: any) => {
  let found = checkall(Object.keys(req.body), arr);
  if (!found) {
    return {
      status: false,
      code: 400,
      type: "invalidRequest",
      message: "mandatory fileds are missing",
      data: arr
    };
  }

  // let getarea: any = await GlobalAreaTable.findAll({
  //   where: { area_id: req.body.area_id }
  // });
  // if (getarea.length == 0) {
  //   return {
  //     status: false,
  //     code: 404,
  //     type: "NotFound",
  //     message: "area id NotFound ",
  //     data: req.body.area_id
  //   };
  // }

  // let getblock: any = await BlockTable.findAll({
  //   where: { area_id: req.body.area_id, block_id: req.body.block_id }
  // });
  // if (getblock.length == 0) {
  //   return {
  //     status: false,
  //     code: 404,
  //     type: "NotFound",
  //     message: "area and block are nonrelated",
  //     data: req.body.block_id
  //   };
  // }
 
  let checkinPh: any = await CustomerTable.findAll({
    where: { phone_no: req.body.phone_no }
  });

  if (checkinPh.length > 0) {
    return {
      status: false,
      code: 309,
      type: "Conflict",
      message: "phone_no already exist",
      data: req.body.phone
    };
  }

  if(req.body.phone_no2 !== ''){
    let checkinPh2: any = await CustomerTable.findAll({
      where: { phone_no2: req.body.phone_no2 }
    });
  
    if (checkinPh2.length > 0) {
      return {
        status: false,
        code: 309,
        type: "Conflict",
        message: "phone_no2 already exist",
        data: req.body.phone
      };
    }
  }
  

  if(req.body.phone_no3 !== ''){
  let checkinPh3: any = await CustomerTable.findAll({
    where: {phone_no3: req.body.phone_no3}
  });

  if (checkinPh3.length > 0) {
    return {
      status: false,
      code: 309,
      type: "Conflict",
      message: "phone_no3 already exist",
      data: req.body.phone
    };
  }
  }
  logger.info("customerDataPOST: all validations passed");
  let res = {
    status: true,
    code: 200,
    type: "success",
    message: "all validations passed",
    data: []
  };
  return res;
};

const updatecustomer = async (req: any) => {
  let found = checkall(Object.keys(req.body), ["customer_id"]);
  if (!found) {
    return { status: false,code: 400,type: "invalidRequest",message: "mandatory fileds are missing", data: arr};
  }

  let getcustomer: any = await CustomerTable.findAll({
    where: { customer_id: req.body.customer_id }
  });
  if (getcustomer.length == 0) {
    return {status: false,code: 404,type: "NotFound",message: "customer id NotFound ",data: req.body.customer_id};
  }
  logger.info("updatecustomer: all validations passed");
  let res = {status: true,code: 200,type: "success", message: "all validations passed", data: []};
  return res;
};

const deletecustomer = async (req: any) => {
  let found = checkall(Object.keys(req.query), ["id"]);
  if (!found) {
    return {status: false,code: 400,type: "invalidRequest",message: "mandatory fileds are missing",data: arr};
  }

  let getcustomer: any = await CustomerTable.findAll({ where: { customer_id: req.query.id }});
  if (getcustomer.length == 0) {
    return {status: false,code: 404,type: "NotFound", message: "customer id NotFound ",data: req.body.customer_id};
  }

  logger.info("deletecustomer: all validations passed");
  let res = {status: true,code: 200,type: "success",message: "all validations passed",data: [] };
  return res;
};

const customercomplaintpost = async (req: any) => {

  if(!checkIsArrayAndNotEmpty(req.body)){
    let res = {status:false,code: 400, type:'invalidRequest', message:'body should be non empty array', data:[]}
    return res
  } 

  for(let i=0; i<req.body.length; i++){
    let mandatory = ["order_id", "complaint_id", "customer_id","brand_id","branch_id"];
    let found = checkall(Object.keys(req.body[i]), mandatory);
    if (!found) {
      return {status: false,code: 400,type: "invalidRequest",message: "mandatory fileds are missing",data: mandatory};
    }


    let getcomplaint: any = await complaintTable.findAll({where: { complaint_id: req.body[i].complaint_id} });
    if (getcomplaint.length == 0) {
      return {status: false,code: 404,type: "NotFound",message: "complaint id NotFound or unrelated",data: req.body[i].complaint_id};
    }

    let getcustomer: any = await CustomerTable.findAll({where: { customer_id: req.body[i].customer_id} });
    if (getcustomer.length == 0) {
      return {status: false,code: 404,type: "NotFound",message: "customer id NotFound ",data: req.body[i].customer_id};
    }


    let getcustomercomplaint: any = await customerComplaints.findAll({where: 
      { customer_id: req.body[i].customer_id, order_id:req.body[i].order_id, complaint_id:req.body[i].complaint_id} });
      if (getcustomercomplaint.length > 0) {
      return {status: false,code: 409,type: "Conflicts",message: "complaint already rised",data: req.body[i].complaint_id};
    }

    if(req.body.length - 1 == i){
      logger.info("customercomplaintpost: all validations passed");
      return {status: true,code: 200, type: "success",message: "all validations passed",data: [] };
    }
  }
};


const updatecustomercomplaints = async (req: any) => {
  let found = checkall(Object.keys(req.body), ["order_id","complaint_id","customer_id"]);
  if (!found) {
    return {status: false,code: 400,type: "invalidRequest",message: "mandatory fileds are missing", data: arr};
  }

  let getcomplaints: any = await complaintTable.findAll({
    where: { complaint_id: req.body.complaint_id }
  });
  if (getcomplaints.length == 0) {
    return {status: false,code: 404,type: "NotFound",message: "complaint_id NotFound ",data: req.body.complaint_id};
  }

  logger.info("updatecustomercomplaints: all validations passed");
  let res = {status: true,code: 200,type: "success", message: "all validations passed", data: []};
  return res;
}

const deletecustomercomplaints = async (req: any) => {
  let found = checkall(Object.keys(req.query), ["customer_complaint_id"]);
  if (!found) {
    return {status: false,code: 400,type: "invalidRequest",message: "mandatory fileds are missing", data: arr};
  }

  let getcustomercomplaints: any = await customerComplaints.findAll({
    where: { customer_complaint_id: req.query.customer_complaint_id }
  });
  if (getcustomercomplaints.length == 0) {
    return {status: false,code: 404,type: "NotFound",message: "customer complaint id NotFound ",data: req.query.customer_id};
  }
  logger.info("deletecustomercomplaints: all validations passed");
  let res = {status: true,code: 200,type: "success", message: "all validations passed", data: []};
  return res;
}
export { customerDataPOST, updatecustomer, deletecustomer,customercomplaintpost,updatecustomercomplaints,deletecustomercomplaints };
