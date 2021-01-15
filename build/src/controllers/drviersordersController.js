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
exports.driverordersController = void 0;
class driverordersController {
    assignDrivers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            // 	const response: any = await TrackorderTable.create(<any>req.body);
            // 	return success(res, response);
            // } catch (err) {
            // 	next({
            // 		status: false,
            // 		message: 'Some error occurred while assginging drivers',
            // 		body: err
            // 	});
            // }
        });
    }
    gerordersWithDrivers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            // 		let ccorder_id:any=req.query.ccorder_id;
            // 		let all:any=req.query.allorders
            // 		// let branch_id=JSON.parse(req.query.branch_id)
            // 		let response
            // 		if(ccorder_id != undefined){
            // 			response=await TrackorderTable.findAll({
            // 				where:{ccorder_id:ccorder_id},
            // 				include:[{
            // 					model:CallcenterTable,
            // 					where:{ccorder_id:ccorder_id},
            // 					include:[{model:CustomerTable},
            // 						{model:BranchTable,attributes:['branch_name','branch_name_arabic']}]
            // 				}]
            // 			})
            // 		}
            // 		if(all == 'true'){
            // 			response=await TrackorderTable.findAll({
            // 				include:[{
            // 					model:CallcenterTable,
            // 					include:[{model:CustomerTable},
            // 						{model:BranchTable,attributes:['branch_name','branch_name_arabic']}]
            // 				}]
            // 			})
            // 		}
            // 				return success(res, response);
            // 	} catch (err) {
            // 		console.log("===",err)
            // 		next({
            // 			status: false,
            // 			message: 'Some error occurred while assginging drivers',
            // 			body: err.message
            // 		});
            // 	}
        });
    }
}
exports.driverordersController = driverordersController;
//# sourceMappingURL=drviersordersController.js.map