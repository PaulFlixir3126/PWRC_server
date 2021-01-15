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
exports.dashboard = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class dashboard {
    netSales(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { sDate, id, eDate, brand_id } = req.query;
                let response1;
                let response2;
                let response3;
                let response4;
                let response5;
                if (id && sDate && brand_id == undefined) {
                    console.log("all");
                    let pastDate = new Date(sDate);
                    pastDate.setDate(pastDate.getDate() - 7).toString();
                    response1 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date = '${sDate}' AND branch_id=${id} AND (status='CashCollected' OR status='Encashed' OR status='WaiterEncashed')`);
                    response2 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date <'${sDate}' and transaction_date>='${pastDate.toISOString()}' AND branch_id=${id} AND (status='CashCollected' OR status='Encashed')`);
                    response3 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >=date_trunc('month',timestamp '${sDate}') - interval '1 month'  AND transaction_date < date_trunc('month', timestamp '${sDate}') AND branch_id=${id} AND (status='CashCollected' OR status='Encashed')`);
                    response4 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}') AND branch_id=${id} AND (status='CashCollected' OR status='Encashed')`);
                    response5 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}') AND branch_id=${id} AND (status='CashCollected' OR status='Encashed')`);
                }
                else if (sDate && brand_id && id == undefined) {
                    console.log("only date, brand no branch");
                    let pastDate = new Date(sDate);
                    pastDate.setDate(pastDate.getDate() - 7).toString();
                    response1 = yield database_1.sequelize.query(`
				 select sum(net_cost) as net_sales from orders where transaction_date = '${sDate}'  AND brand_id=${brand_id} AND (status='CashCollected' OR status='Encashed' OR status='WaiterEncashed')`);
                    response2 = yield database_1.sequelize.query(`
				 select sum(net_cost) as net_sales from orders where transaction_date <'${sDate}' and transaction_date>='${pastDate.toISOString()}' AND brand_id=${brand_id} AND (status='CashCollected' OR status='Encashed')`);
                    response3 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >=date_trunc('month',timestamp '${sDate}') - interval '1 month'  AND transaction_date < date_trunc('month', timestamp '${sDate}') AND brand_id=${brand_id} AND (status='CashCollected' OR status='Encashed')`);
                    response4 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}') AND brand_id=${brand_id} AND (status='CashCollected' OR status='Encashed')`);
                    response5 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}') AND brand_id=${brand_id} AND (status='CashCollected' OR status='Encashed')`);
                }
                else if (sDate && brand_id == undefined && id == undefined) {
                    console.log("only date");
                    let pastDate = new Date(sDate);
                    pastDate.setDate(pastDate.getDate() - 7).toString();
                    response1 = yield database_1.sequelize.query(`
	select sum(net_cost) as net_sales from orders where transaction_date = '${sDate}'   AND (status='CashCollected' OR status='Encashed' OR status='WaiterEncashed')`);
                    response2 = yield database_1.sequelize.query(`
	select sum(net_cost) as net_sales from orders where transaction_date <'${sDate}' and transaction_date>='${pastDate.toISOString()}'  AND (status='CashCollected' OR status='Encashed')`);
                    response3 = yield database_1.sequelize.query(`
 select sum(net_cost) as net_sales from orders where transaction_date >=date_trunc('month',timestamp '${sDate}') - interval '1 month'  AND transaction_date < date_trunc('month', timestamp '${sDate}')  AND (status='CashCollected' OR status='Encashed')`);
                    response4 = yield database_1.sequelize.query(`
 select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}') AND (status='CashCollected' OR status='Encashed')`);
                    response5 = yield database_1.sequelize.query(`
 select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month',timestamp '${sDate}')  AND (status='CashCollected' OR status='Encashed')`);
                }
                else {
                    response1 = yield database_1.sequelize.query(`
                select sum(net_cost) as net_sales from orders where transaction_date = current_date AND (status='CashCollected' OR status='Encashed')`);
                    response2 = yield database_1.sequelize.query(`
                select sum(net_cost) as net_sales from orders where transaction_date > current_date - interval '7' day AND (status='CashCollected' OR status='Encashed')`);
                    response3 = yield database_1.sequelize.query(`
                select sum(net_cost) as net_sales from orders where transaction_date >=date_trunc('month', now()) - interval '1 month'  AND transaction_date < date_trunc('month', now())  AND (status='CashCollected' OR status='Encashed')`);
                    response4 = yield database_1.sequelize.query(`
				select sum(net_cost) as net_sales from orders where transaction_date >= date_trunc('month', now()) AND (status='CashCollected' OR status='Encashed')`);
                    response5 = yield database_1.sequelize.query(`
                select sum(net_cost) as net_sales,EXTRACT(year FROM current_date) as year from orders where (status='CashCollected' OR status='Encashed') group by year`);
                }
                let data = {
                    dailySales: response1[0],
                    weelkySales: response2[0],
                    lastMonthSales: response3[0],
                    monthlySales: response4[0],
                    yearlySales: response5[0]
                };
                return response_1.success(res, data);
            }
            catch (err) {
                console.log("eeeeeee", err);
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: err
                });
            }
        });
    }
    salesGraph(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let { id, brand_id, fromdate, branch_id } = req.query;
                /**fromdate calculate 6 month back date */
                let dateQuery = ``;
                if (fromdate) {
                    let d = new Date(fromdate);
                    d.setMonth(d.getMonth() - 6);
                    dateQuery = ` transaction_date >=  '${d.toISOString().slice(0, 10)}'  and transaction_date <= '${fromdate}' `;
                }
                /**if branch id with no date */
                if (id) {
                    console.log("id if", id);
                    response = yield database_1.sequelize.query(`SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where  transaction_date > CURRENT_DATE - INTERVAL '6 months' and branch_id=${id} and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy`);
                }
                /**if brand_id with date */
                else if (brand_id && fromdate) {
                    console.log("brand date if queryyyy", brand_id, fromdate);
                    response = yield database_1.sequelize.query(`SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where  transaction_date >=date_trunc('month',timestamp '${fromdate}') - interval '6 month' and brand_id=${brand_id} and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy`);
                }
                /**if branch_id with date*/
                else if (branch_id && fromdate) {
                    console.log("branch, fromdate if queryyyy", branch_id, fromdate);
                    response = yield database_1.sequelize.query(`SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where  transaction_date >=date_trunc('month',timestamp '${fromdate}') - interval '6 month' and branch_id=${branch_id} and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy`);
                }
                /**all brand,branch with date */
                else if (fromdate) {
                    console.log("fromdate if queryyyy", fromdate);
                    response = yield database_1.sequelize.query(`SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where   transaction_date >=date_trunc('month',timestamp '${fromdate}') - interval '6 month'  and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy`);
                }
                /**all brand,branch with current date */
                else {
                    console.log("elllllllllse");
                    response = yield database_1.sequelize.query(`SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where transaction_date > CURRENT_DATE - INTERVAL '6 months' and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy`);
                }
                return response_1.success(res, response[0]);
                // SELECT  sum(net_cost) as net_sales ,EXTRACT(MONTH FROM transaction_date) as month_id, 
                // to_char(transaction_date,'Mon') as month,extract(year from transaction_date) as yyyy from orders where   AND transaction_date >=  '2019-10-25'  AND transaction_date <= '2020-10-25'  and branch_id=undefined and (status='CashCollected' OR status='Encashed') group by month,month_id,yyyy order by month_id,yyyy
            }
            catch (error) {
                console.log("eeee", error);
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: error
                });
            }
        });
    }
    trendingItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let filterArray = [];
                let { id, sDate, brand_id } = req.query;
                if (id) {
                    response = yield database_1.sequelize.query(`SELECT order_details from orders where transaction_date = '${sDate}' AND branch_id=${id}`);
                }
                else if (brand_id) {
                    response = yield database_1.sequelize.query(`SELECT order_details from orders where transaction_date = '${sDate}' AND brand_id=${brand_id}`);
                }
                else if (sDate) {
                    response = yield database_1.sequelize.query(`SELECT order_details from orders where transaction_date = '${sDate}'`);
                }
                else {
                    response = yield database_1.sequelize.query(`SELECT order_details from orders where transaction_date = current_date`);
                }
                let data = JSON.parse(JSON.stringify(response));
                data[0].forEach((r) => {
                    r.order_details.forEach((e) => {
                        filterArray.push({
                            menu_name: e.menu_name,
                            quantity: e.quantity,
                            menu_name_arabic: e.menu_name_arabic
                        });
                    });
                });
                let result = filterArray
                    .reduce(function (res, obj) {
                    if (!(obj.menu_name in res))
                        res.data.push((res[obj.menu_name] = obj));
                    else {
                        res[obj.menu_name].quantity += obj.quantity;
                    }
                    return res;
                }, { data: [] })
                    .data.sort(function (a, b) {
                    return b.quantity - a.quantity;
                });
                return response_1.success(res, result);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: error
                });
            }
        });
    }
    trendingItem1(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let filterArray = [];
                response = yield database_1.sequelize.query(`SELECT order_details from orders where transaction_date = current_date - 1`);
                let data = JSON.parse(JSON.stringify(response));
                data[0].forEach((r) => {
                    r.order_details.forEach((e) => {
                        filterArray.push({
                            menu_name: e.menu_name,
                            quantity: e.quantity,
                            menu_name_arabic: e.menu_name_arabic
                        });
                    });
                });
                let result = filterArray.reduce(function (res, obj) {
                    if (!(obj.menu_name in res))
                        res.data.push((res[obj.menu_name] = obj));
                    else {
                        res[obj.menu_name].quantity += obj.quantity;
                    }
                    return res;
                }, { data: [] })
                    .data.sort(function (a, b) {
                    return b.quantity - a.quantity;
                });
                return response_1.success(res, result);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: error
                });
            }
        });
    }
    salesSummaryGraph(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let wherequery = {};
                let query = req.query;
                if (req.query.filterByBranch || req.query.filterByBrand) {
                    if (parseInt(query.filterByBrand)) {
                        wherequery = { brand_id: req.query.brand_id };
                    }
                    if (parseInt(query.filterByBranch)) {
                        wherequery = { branch_id: req.query.branch_id };
                    }
                    if (query.fromdate && query.todate) {
                        wherequery['transaction_date'] = { [database_1.Op.between]: [req.query.fromdate, req.query.todate] };
                    }
                }
                else {
                    wherequery['status'] = { [database_1.Op.or]: ['CashCollected', 'Encashed'] };
                    if (req.query.fromdate && req.query.todate) {
                        wherequery['transaction_date'] = { [database_1.Op.between]: [req.query.fromdate, req.query.todate] };
                    }
                }
                response = yield database_1.OrderTable.findAll({
                    where: wherequery,
                    limit: 7,
                    attributes: ['transaction_date', [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']],
                    group: ['transaction_date'],
                    order: [['transaction_date', 'DESC']]
                });
                response_1.success(res, response.reverse());
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while fetching  data',
                    body: error
                });
            }
        });
    }
}
exports.dashboard = dashboard;
//# sourceMappingURL=dashboardController.js.map