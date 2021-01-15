import {checkIsObjectAndNotEmpty, checkIsArrayAndNotEmpty, checkIsSet,checkIsInputObjectContainsUnknownKeys,includesIn,checkall} from "../validators/genericValidator"
import logger from '../lib/logger';
import {} from '../db/database';
let arr=['category_name','category_name_arabic','brand_id','category_status']

// const categoryDataPOST = async (req:any) => {
// let found= checkall(Object.keys(req.body), arr);
//   if(!found){
//     return {status:false,code: 400, type:'invalidRequest', message:'mandatory fileds are missing', data:arr}
//   }

//   let getbrand: any = await BrandTable.findAll({where: { brand_id: req.body.brand_id}});
//     if(getbrand.length == 0){
//       return  {status:false,code: 404, type:'NotFound', message:'brand id NotFound ', data:req.body.brand_id}
//     }

//     let getcategoryenglish: any = await cct.findAll({where: {brand_id: req.body.brand_id, category_name: req.body.category_name}});
//     let getcategoryarbic: any = await cct.findAll({where: {brand_id: req.body.brand_id,category_name_arabic: req.body.category_name_arabic}});
    
//     if(getcategoryenglish.length > 0 || getcategoryarbic.length >0){
//       return {status:false,code: 400, type:'invalidRequest', message:'category name already exists', data:[req.body.category_name,req.body.category_name_arabic]}
//     }
//    logger.info("categoryDataPOST: all validations passed")
//    let res = {status:true,code: 200, type:'success', message:'all validations passed', data:[]}
//    return res
// };



// const updateCategoryData = async (req:any) => {
//   let found= checkall(Object.keys(req.body), ['category_id','brand_id']);
//     if(!found){
//       return {status:false,code: 400, type:'invalidRequest', message:'mandatory fileds are missing', data:['category_id','brand_id']}
//     }
  
//     let getcct: any = await cct.findAll({where: { category_id: req.body.category_id, brand_id:req.body.brand_id}});
//       if(getcct.length == 0){
//         return  {status:false,code: 404, type:'NotFound', message:'category id NotFound ', data:req.body.category_id}
//       }
  
//      logger.info("updateCategoryData: all validations passed")
//      let res = {status:true,code: 200, type:'success', message:'all validations passed', data:[]}
//      return res
//   };

//   const deleteCategoryData = async (req:any) => {
//     let found= checkall(Object.keys(req.query), ['id']);
//       if(!found){
//         return {status:false,code: 400, type:'invalidRequest', message:'mandatory fileds are missing', data:['id']}
//       }
//       let getcct: any = await cct.findAll({where: { category_id: req.query.id}});
//       if(getcct.length == 0){
//         return  {status:false,code: 404, type:'NotFound', message:'category id NotFound ', data:req.query.id}
//       }
//        logger.info("deleteCategoryData: all validations passed")
//        let res = {status:true,code: 200, type:'success', message:'all validations passed', data:[]}
//        return res
//     };

// export {categoryDataPOST,updateCategoryData,deleteCategoryData}
