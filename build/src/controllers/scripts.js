"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class scriptController {
    createExtraColumnforExistingTable(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tableName = req.query.tableName;
                let columnName = req.query.columnName;
                let columnType = req.query.columnType;
                let before = `select column_name  from information_schema.columns where table_name='${tableName}'`;
                let before1 = yield database_1.sequelize.query(before);
                let query = `ALTER TABLE ${tableName} ADD COLUMN ${columnName}  ${columnType}`;
                console.log("alter query", query);
                let createcolumn = yield database_1.sequelize.query(query);
                let after = `select column_name  from information_schema.columns where table_name='${tableName}'`;
                let after1 = yield database_1.sequelize.query(after);
                let obj = { before: before1[0], after: after1[0] };
                return response_1.success(res, obj);
            }
            catch (error) {
                console.log("eeeeeee", error);
                next({
                    status: false,
                    message: "Some error occurred while createExtraColumnforExistingTable",
                    body: error.message
                });
            }
        });
    }
    deleteFullTable(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tableName = req.query.tableName;
                let after = `DROP TABLE if exists ${tableName} cascade;`;
                let deletetable = yield database_1.sequelize.query(after);
                return response_1.success(res, deletetable);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while createExtraColumnforExistingTable",
                    body: error.message
                });
            }
        });
    }
    updateUnitPrice(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let UpdateMasteritemPrice = yield database_1.sequelize.query(`UPDATE masteritems m
    SET last_price= f.valsum,
     average_price = f.valsum
    FROM 
    (
      SELECT item_id, AVG(unitprice) valsum
      FROM grvitems
      GROUP BY  item_id 
    ) f
    WHERE m.item_id = f.item_id`);
                console.log("UpdateMasteritemPrice", UpdateMasteritemPrice);
                let UpdateStockPrice = yield database_1.sequelize.query(`UPDATE stockdetails m
    SET last_price= f.valsum,
     average_price = f.valsum
    FROM 
    (
      SELECT item_id, AVG(unitprice) valsum
      FROM grvitems
      GROUP BY  item_id 
    ) f
    WHERE m.item_id = f.item_id`);
                console.log("UpdateMasteritemPrice", UpdateStockPrice);
                let obj = { masterItemPrice: UpdateMasteritemPrice, stockdetailprice: UpdateStockPrice };
                return response_1.success(res, obj);
            }
            catch (error) {
                next({
                    status: false,
                    message: "Some error occurred while updateUnitPrice",
                    body: error.message
                });
            }
        });
    }
}
exports.scriptController = scriptController;
//# sourceMappingURL=scripts.js.map