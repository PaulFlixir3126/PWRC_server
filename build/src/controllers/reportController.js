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
exports.returnReport = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class returnReport {
    cardTypes(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            response = yield database_1.GlobalCardTable.findAll();
            let response1 = JSON.parse(JSON.stringify(response));
            response1.map((r) => {
                data.map((e) => {
                    if (r.payment_id == e.payment_id) {
                        e.card_type = r.payment_type_english;
                        e.card_type_arabic = r.payment_type_arabic;
                    }
                });
            });
            return data;
        });
    }
    returnReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                const { sDate, eDate, branch_id, brand_id, role, user, segment } = req.query;
                const queryObj = {
                    sDate: sDate || null,
                    eDate: eDate || null,
                    role: role || null,
                    user: user || null,
                    segment: segment || null
                };
                let dateQuery = '';
                let roleQuery = '';
                let userQuery = '';
                let segmentQuery = '';
                if (queryObj.sDate && queryObj.eDate) {
                    dateQuery =
                        ' AND transaction_date >=' +
                            "'" +
                            queryObj.sDate +
                            "'" +
                            ' AND transaction_date <=' +
                            "'" +
                            queryObj.eDate +
                            "'";
                }
                if (queryObj.role) {
                    roleQuery = ' AND user_role =' + "'" + queryObj.role + "'";
                }
                if (queryObj.user) {
                    userQuery = ' AND user_id =' + "'" + queryObj.user + "'";
                }
                if (queryObj.segment) {
                    segmentQuery = ' AND segment_key =' + "'" + queryObj.segment + "'";
                }
                if (branch_id == '') {
                    console.log("-->>", 'SELECT * from orders ' +
                        'WHERE brand_id= ' +
                        brand_id +
                        dateQuery +
                        roleQuery +
                        segmentQuery +
                        userQuery +
                        `AND (status='CashCollected' OR status='Encashed')`);
                    response = yield database_1.sequelize.query('SELECT * from orders ' +
                        'WHERE brand_id= ' +
                        brand_id +
                        dateQuery +
                        roleQuery +
                        segmentQuery +
                        userQuery +
                        `AND (status='CashCollected' OR status='Encashed')`);
                }
                else {
                    console.log("**************", 'SELECT * from orders ' +
                        'WHERE branch_id= ' +
                        branch_id +
                        'AND brand_id= ' +
                        brand_id +
                        dateQuery +
                        roleQuery +
                        segmentQuery +
                        userQuery +
                        `AND (status='CashCollected' OR status='Encashed')`);
                    response = yield database_1.sequelize.query('SELECT * from orders ' +
                        'WHERE branch_id= ' +
                        branch_id +
                        'AND brand_id= ' +
                        brand_id +
                        dateQuery +
                        roleQuery +
                        segmentQuery +
                        userQuery +
                        `AND (status='CashCollected' OR status='Encashed')`);
                }
                let classObject = new returnReport();
                response[0].sort((a, b) => +b.order_id - +a.order_id);
                let data = yield classObject.cardTypes(response[0]);
                return response_1.success(res, data);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving Reports',
                    body: err
                });
            }
        });
    }
    groupBy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sDate, eDate, branch_id, groupBy, role, user, segment } = req.query;
                const queryObj = {
                    sDate: sDate || null,
                    eDate: eDate || null,
                    role: role || null,
                    user: user || null,
                    segment: segment || null
                };
                let dateQuery = '';
                let roleQuery = '';
                let userQuery = '';
                let segmentQuery = '';
                if (queryObj.sDate && queryObj.eDate) {
                    dateQuery =
                        ' AND transaction_date >=' +
                            "'" +
                            queryObj.sDate +
                            "'" +
                            ' AND transaction_date <=' +
                            "'" +
                            queryObj.eDate +
                            "'";
                }
                if (queryObj.role) {
                    roleQuery = ' AND user_role =' + "'" + queryObj.role + "'";
                }
                if (queryObj.user) {
                    userQuery = ' AND user_name =' + "'" + queryObj.user + "'";
                }
                if (queryObj.segment) {
                    segmentQuery = ' AND segment_key =' + "'" + queryObj.segment + "'";
                }
                let response;
                let dine_in_total = 0;
                let dine_in_count = 0;
                let take_out_total = 0;
                let take_out_count = 0;
                let car_service_total = 0;
                let car_service_count = 0;
                let staff_meal_total = 0;
                let staff_meal_count = 0;
                let catering_total = 0;
                let catering_count = 0;
                let delivery_total = 0;
                let deliver_count = 0;
                if (groupBy === 'user_name') {
                    let query = '';
                    if (branch_id == '') {
                        query = `SELECT COUNT(*),user_id,branch_id,segment_key,SUM (net_cost) AS cash_amount,SUM(card_amount) AS card_amount FROM orders WHERE (status='CashCollected' OR status='Encashed') ${dateQuery}${segmentQuery}GROUP BY branch_id,user_id,segment_key`;
                    }
                    else {
                        query = `SELECT COUNT(*),user_id,branch_id,segment_key,SUM (net_cost) AS cash_amount,SUM(card_amount) AS card_amount FROM orders WHERE (status='CashCollected' OR status='Encashed') AND branch_id=${branch_id}${dateQuery}${segmentQuery}GROUP BY branch_id,user_id,segment_key`;
                    }
                    response = yield database_1.sequelize.query(query);
                    response[0].sort((a, b) => +a.order_id - +b.order_id);
                    let data = JSON.parse(JSON.stringify(response));
                    yield data[0].forEach((element) => {
                        if (element.segment_key == 'dine_in') {
                            dine_in_total += element.cash_amount;
                            dine_in_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'take_out') {
                            take_out_total += element.cash_amount;
                            take_out_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'car_service') {
                            car_service_total += element.cash_amount;
                            car_service_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'staff_meal') {
                            staff_meal_total += element.cash_amount;
                            staff_meal_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'catering') {
                            catering_total += element.cash_amount;
                            catering_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'delivery') {
                            delivery_total += element.cash_amount;
                            deliver_count += parseInt(element.count);
                        }
                    });
                    let group_to_values = data[0].reduce(function (obj, item) {
                        obj[item.user_id] = obj[item.user_id] || [];
                        obj[item.user_id].push(item);
                        return obj;
                    }, {});
                    let groups = Object.keys(group_to_values).map(function (key) {
                        let segmentArray = group_to_values[key];
                        let segment = {};
                        segmentArray.forEach((element) => {
                            segment[element.segment_key] = element;
                        });
                        return { group_id: key, segment };
                    });
                    let allData = {
                        groups,
                        dine_in_total: dine_in_total,
                        take_out_total: take_out_total,
                        car_service_total: car_service_total,
                        staff_meal_total: staff_meal_total,
                        catering_total: catering_total,
                        delivery_total: delivery_total,
                        dine_in_count: dine_in_count,
                        take_out_count: take_out_count,
                        car_service_count: car_service_count,
                        deliver_count: deliver_count,
                        catering_count: catering_count,
                        staff_meal_count: staff_meal_count
                    };
                    return response_1.success(res, allData);
                }
                if (groupBy === 'payment_type') {
                    response = yield database_1.sequelize.query(`SELECT COUNT(*),branch_id,segment_key,card_type,SUM (net_cost - card_amount) AS cash_amount,SUM(card_amount) AS card_amount FROM orders WHERE (status='CashCollected' OR status='Encashed') AND branch_id=${branch_id}${dateQuery}${roleQuery}${userQuery}${segmentQuery} GROUP BY branch_id,segment_key,card_type`);
                    response[0].sort((a, b) => +a.order_id - +b.order_id);
                    let data = JSON.parse(JSON.stringify(response));
                    yield data[0].forEach((element) => {
                        if (element.segment_key == 'dine_in') {
                            dine_in_total += element.card_amount;
                            dine_in_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'take_out') {
                            take_out_total += element.card_amount;
                            take_out_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'car_service') {
                            car_service_total += element.card_amount;
                            car_service_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'staff_meal') {
                            staff_meal_total += element.card_amount;
                            staff_meal_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'catering') {
                            catering_total += element.card_amount;
                            catering_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'delivery') {
                            delivery_total += element.card_amount;
                            deliver_count += parseInt(element.count);
                        }
                    });
                    let group_to_values = data[0].reduce(function (obj, item) {
                        obj[item.segment_key] = obj[item.segment_key] || [];
                        obj[item.segment_key].push(item);
                        return obj;
                    }, {});
                    let groups = Object.keys(group_to_values).map(function (key) {
                        let segmentArray = group_to_values[key];
                        let segment = {};
                        segmentArray.forEach((element) => {
                            segment[element.segment_key] = element;
                        });
                        return { group: key, segment };
                    });
                    let allData = {
                        groups,
                        dine_in_total: dine_in_total,
                        take_out_total: take_out_total,
                        car_service_total: car_service_total,
                        staff_meal_total: staff_meal_total,
                        catering_total: catering_total,
                        delivery_total: delivery_total,
                        dine_in_count: dine_in_count,
                        take_out_count: take_out_count,
                        car_service_count: car_service_count,
                        deliver_count: deliver_count,
                        catering_count: catering_count,
                        staff_meal_count: staff_meal_count
                    };
                    return response_1.success(res, allData);
                }
                if (groupBy === 'transaction_date') {
                    let query = '';
                    if (branch_id == '') {
                        query = `SELECT to_char("transaction_date",'DD/MM/YYYY') AS transaction_date ,COUNT(*),branch_id,segment_key,SUM (net_cost) AS cash_amount,SUM(card_amount) AS card_amount FROM orders WHERE (status='CashCollected' OR status='Encashed')  ${dateQuery}${segmentQuery} GROUP BY branch_id,segment_key,transaction_date`;
                    }
                    else {
                        query = `SELECT to_char("transaction_date",'DD/MM/YYYY') AS transaction_date ,COUNT(*),branch_id,segment_key,SUM (net_cost) AS cash_amount,SUM(card_amount) AS card_amount FROM orders WHERE (status='CashCollected' OR status='Encashed') AND branch_id=${branch_id}${dateQuery}${segmentQuery} GROUP BY branch_id,segment_key,transaction_date`;
                    }
                    response = yield database_1.sequelize.query(query);
                    let data = JSON.parse(JSON.stringify(response));
                    yield data[0].forEach((element) => {
                        if (element.segment_key == 'dine_in') {
                            dine_in_total += element.cash_amount;
                            dine_in_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'take_out') {
                            take_out_total += element.cash_amount;
                            take_out_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'car_service') {
                            car_service_total += element.cash_amount;
                            car_service_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'staff_meal') {
                            staff_meal_total += element.cash_amount;
                            staff_meal_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'catering') {
                            catering_total += element.cash_amount;
                            catering_count += parseInt(element.count);
                        }
                        if (element.segment_key == 'delivery') {
                            delivery_total += element.cash_amount;
                            deliver_count += parseInt(element.count);
                        }
                    });
                    let group_to_values = data[0].reduce(function (obj, item) {
                        obj[item.transaction_date] = obj[item.transaction_date] || [];
                        obj[item.transaction_date].push(item);
                        return obj;
                    }, {});
                    let groups = Object.keys(group_to_values).map(function (key) {
                        let segmentArray = group_to_values[key];
                        let segment = {};
                        segmentArray.forEach((element) => {
                            segment[element.segment_key] = element;
                        });
                        return { group: key, segment };
                    });
                    groups.sort((date1, date2) => {
                        date1 = date1.group
                            .split('/')
                            .reverse()
                            .join('');
                        date2 = date2.group
                            .split('/')
                            .reverse()
                            .join('');
                        return date2.localeCompare(date1);
                    });
                    let allData = {
                        groups,
                        dine_in_total: dine_in_total,
                        take_out_total: take_out_total,
                        car_service_total: car_service_total,
                        staff_meal_total: staff_meal_total,
                        catering_total: catering_total,
                        delivery_total: delivery_total,
                        dine_in_count: dine_in_count,
                        take_out_count: take_out_count,
                        car_service_count: car_service_count,
                        deliver_count: deliver_count,
                        catering_count: catering_count,
                        staff_meal_count: staff_meal_count
                    };
                    return response_1.success(res, allData);
                }
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving Reports',
                    body: err.message
                });
            }
        });
    }
    productReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sDate, eDate, branch_id } = req.query;
                const queryObj = {
                    sDate: sDate || null,
                    eDate: eDate || null
                };
                let dateQuery = '';
                if (queryObj.sDate && queryObj.eDate) {
                    dateQuery =
                        ' AND transaction_date >=' +
                            "'" +
                            queryObj.sDate +
                            "'" +
                            ' AND transaction_date <=' +
                            "'" +
                            queryObj.eDate +
                            "'";
                }
                let response;
                let filter = [];
                // let ku = await sequelize.query(
                // 	`select * from orders 
                // 	where order_id=5808
                // 	`
                // );
                // let ab: any = JSON.stringify(ku);
                // console.log("***********",ab)
                response = yield database_1.sequelize.query(`select * from orders where branch_id=${branch_id}${dateQuery}`);
                let result = JSON.parse(JSON.stringify(response));
                // return success(res, result);
                result[0].map((r) => {
                    r.order_details.map((e) => {
                        // console.log("_____________",e.menu_id)
                        filter.push(e);
                    });
                });
                let group_to_values = filter.reduce(function (obj, item) {
                    obj[item.category_name] = obj[item.category_name] || [];
                    obj[item.category_name].push(item);
                    return obj;
                }, {});
                let grouped = [];
                let duplicate = new Set();
                let obj;
                let real_price = 0;
                let groups = Object.keys(group_to_values).map(function (key) {
                    let menu = {};
                    group_to_values[key].map(function (o, i) {
                        if (!menu[o.menu_name]) {
                            menu[o.menu_name] = {
                                menu_name: o.menu_name,
                                menu_name_arabic: o.menu_name_arabic,
                                quantity: 0,
                                price: 0,
                                total_price: 0,
                                category_name: o.category_name
                            };
                            grouped.push(menu[o.menu_name]);
                        }
                        real_price = 0;
                        o.allsubItems.map((r) => {
                            real_price += parseFloat(r.item_price);
                        });
                        menu[o.menu_name].quantity += parseInt(o.quantity);
                        menu[o.menu_name].price = o.item_price + real_price;
                        menu[o.menu_name].total_price += o.quantity * (real_price + o.item_price);
                        obj = {
                            categoryName: key,
                            itemDetails: menu[o.menu_name]
                        };
                        duplicate.add(obj.itemDetails);
                    }, Object.create(null));
                });
                group_to_values = Array.from(duplicate).reduce(function (obj, item) {
                    obj[item.category_name] = obj[item.category_name] || [];
                    obj[item.category_name].push(item);
                    return obj;
                }, {});
                let data = Object.keys(group_to_values).map(function (key) {
                    return { categoryName: key, itemDetails: group_to_values[key] };
                });
                return response_1.success(res, data);
            }
            catch (error) {
                console.log("eeeee", error);
                next({
                    status: false,
                    message: 'Some error occurred while retrieving Reports',
                    body: error.message
                });
            }
        });
    }
    brandReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response;
                let brand_filter = [];
                let branch_filter = [];
                let { brand_id, branch_id, sDate, eDate, raw } = req.query;
                if (raw == 1) {
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: ['segment_key', [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']],
                        include: [
                            {
                                model: database_1.BranchTable,
                                attributes: ['branch_name', 'branch_id'],
                                include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                            }
                        ],
                        group: ['segment_key', 'branch.branch_id', 'branch->brand.brand_id']
                    });
                }
                if (raw == 2) {
                    let branches = yield database_1.BranchTable.findAll({
                        where: { brand_id: brand_id },
                        attributes: ['branch_id'],
                        raw: true
                    });
                    branch_filter = branches.map((r) => {
                        return Number(r.branch_id);
                    });
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            branch_id: branch_filter,
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: ['segment_key', [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']],
                        include: [
                            {
                                model: database_1.BranchTable,
                                attributes: ['branch_name', 'branch_id'],
                                include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                            }
                        ],
                        group: ['segment_key', 'branch.branch_id', 'branch->brand.brand_id']
                    });
                }
                if (raw == 3) {
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            branch_id: branch_id,
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: ['segment_key', [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']],
                        include: [
                            {
                                model: database_1.BranchTable,
                                attributes: ['branch_name', 'branch_id'],
                                include: [{ model: database_1.BrandTable, attributes: ['brand_name'] }]
                            }
                        ],
                        group: ['segment_key', 'branch.branch_id', 'branch->brand.brand_id']
                    });
                }
                let responseTest = JSON.parse(JSON.stringify(response));
                let group_to_values = responseTest.reduce(function (obj, item) {
                    obj[item.branch.branch_id] = obj[item.branch.branch_id] || [];
                    obj[item.branch.branch_id].push(item);
                    return obj;
                }, {});
                let groups = Object.keys(group_to_values).map(function (key, i) {
                    let segmentArray = group_to_values[key];
                    let segment = {};
                    segmentArray.forEach((element) => {
                        segment[element.segment_key] = element;
                    });
                    return { group: key, segment };
                });
                let filterArray = [];
                groups.forEach((r) => {
                    filterArray.push(Number(r.group));
                });
                let responseBrandsBranches = yield database_1.BranchTable.findAll({
                    where: { branch_id: filterArray },
                    attributes: ['branch_name', 'branch_id'],
                    include: [
                        {
                            model: database_1.BrandTable,
                            attributes: ['brand_name', 'brand_id']
                        }
                    ]
                });
                responseBrandsBranches.map((e) => {
                    groups.map((r) => {
                        if (e.branch_id == r.group) {
                            r.branch_name = e.branch_name;
                            r.brand_name = e.brand.brand_name;
                        }
                    });
                });
                return response_1.success(res, yield groups);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving Reports',
                    body: error
                });
            }
        });
    }
    brandReportByDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /** raw =1 all brand,branch with from to dates
                 *  raw =2 with brand only with from todates
                 *  rqw =3 with branch only with from to dates
                */
                let response;
                let branch_filter = [];
                let { brand_id, branch_id, sDate, eDate, raw } = req.query;
                if (raw == 1) {
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: [
                            'segment_key',
                            'transaction_date',
                            [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']
                        ],
                        group: ['segment_key', 'transaction_date'],
                        order: [['transaction_date', 'DESC']]
                    });
                }
                if (raw == 2) {
                    let branches = yield database_1.BranchTable.findAll({
                        where: { brand_id: brand_id },
                        attributes: ['branch_id'],
                        raw: true
                    });
                    branch_filter = branches.map((r) => {
                        return Number(r.branch_id);
                    });
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            branch_id: branch_filter,
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: [
                            'segment_key',
                            'transaction_date',
                            [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']
                        ],
                        group: ['segment_key', 'transaction_date'],
                        order: [['transaction_date', 'DESC']]
                    });
                }
                if (raw == 3) {
                    response = yield database_1.OrderTable.findAll({
                        where: {
                            transaction_date: {
                                [database_1.Op.between]: [sDate, eDate]
                            },
                            branch_id: branch_id,
                            status: {
                                [database_1.Op.or]: ['CashCollected', 'Encashed']
                            }
                        },
                        attributes: [
                            'segment_key',
                            'transaction_date',
                            [database_1.sequelize.fn('sum', database_1.sequelize.col('net_cost')), 'total']
                        ],
                        group: ['segment_key', 'transaction_date'],
                        order: [['transaction_date', 'DESC']]
                    });
                }
                let data = JSON.parse(JSON.stringify(response));
                let group_to_values = data.reduce(function (obj, item) {
                    obj[item.transaction_date] = obj[item.transaction_date] || [];
                    obj[item.transaction_date].push(item);
                    return obj;
                }, {});
                let groups = Object.keys(group_to_values).map(function (key, i) {
                    let segmentArray = group_to_values[key];
                    let segment = {};
                    segmentArray.forEach((element) => {
                        segment[element.segment_key] = element;
                    });
                    return { transaction_date: key, segment };
                });
                return response_1.success(res, groups);
            }
            catch (error) {
                next({
                    status: false,
                    message: 'Some error occurred while retrieving Reports',
                    body: error
                });
            }
        });
    }
}
exports.returnReport = returnReport;
//# sourceMappingURL=reportController.js.map