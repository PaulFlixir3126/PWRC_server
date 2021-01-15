import { Request, Response, NextFunction } from "express";
import {Sequelize,sequelize,
   Op} from "../db/database";
import { success } from "../lib/response";

export class scriptController {


  
  async createExtraColumnforExistingTable(req: Request, res: Response, next: NextFunction) {
      try {
         let tableName=req.query.tableName;
         let columnName=req.query.columnName;
         let columnType=req.query.columnType;

         let before=`select column_name  from information_schema.columns where table_name='${tableName}'`
         let before1=await sequelize.query(before);
        let query=`ALTER TABLE ${tableName} ADD COLUMN ${columnName}  ${columnType}`
        console.log("alter query",query)
        let createcolumn=await sequelize.query(query);

        let after=`select column_name  from information_schema.columns where table_name='${tableName}'`
        let after1=await sequelize.query(after);
        let obj={before:before1[0],after:after1[0]}
        return success(res, obj);
      } catch (error) {
        console.log("eeeeeee",error)
        next({
        status: false,
        message: "Some error occurred while createExtraColumnforExistingTable",
        body: error.message
      });
      }
  }


  async deleteFullTable(req: Request, res: Response, next: NextFunction) {
    try {
       let tableName=req.query.tableName;
      let after=`DROP TABLE if exists ${tableName} cascade;`
      let deletetable=await sequelize.query(after);
      return success(res, deletetable);
    } catch (error) {
      next({
      status: false,
      message: "Some error occurred while createExtraColumnforExistingTable",
      body: error.message
    });
    }
}
 


  


  async updateUnitPrice(req: Request, res: Response, next: NextFunction) {
   try {
    let UpdateMasteritemPrice = await sequelize.query(`UPDATE masteritems m
    SET last_price= f.valsum,
     average_price = f.valsum
    FROM 
    (
      SELECT item_id, AVG(unitprice) valsum
      FROM grvitems
      GROUP BY  item_id 
    ) f
    WHERE m.item_id = f.item_id`);
  
    console.log("UpdateMasteritemPrice",UpdateMasteritemPrice)

    let UpdateStockPrice = await sequelize.query(`UPDATE stockdetails m
    SET last_price= f.valsum,
     average_price = f.valsum
    FROM 
    (
      SELECT item_id, AVG(unitprice) valsum
      FROM grvitems
      GROUP BY  item_id 
    ) f
    WHERE m.item_id = f.item_id`);
  
    console.log("UpdateMasteritemPrice",UpdateStockPrice)
  let obj={masterItemPrice:UpdateMasteritemPrice, stockdetailprice:UpdateStockPrice}
    return success(res, obj);
   } catch (error) {
    next({
      status: false,
      message: "Some error occurred while updateUnitPrice",
      body: error.message
    });
   }
  }
}
