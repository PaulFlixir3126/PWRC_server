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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAddressTable = exports.subcomplaintTable = exports.customerComplaints = exports.complaintTable = exports.CustomerTable = exports.Op = exports.Sequelize = exports.sequelize = void 0;
const globalLogger_1 = __importDefault(require("../lib/globalLogger"));
const sequelize_1 = __importDefault(require("sequelize"));
exports.Sequelize = sequelize_1.default;
globalLogger_1.default.silly(`DB_NAME- ${process.env.DB_NAME}`);
globalLogger_1.default.silly(`DB_USERNAME- ${process.env.DB_USERNAME}`);
globalLogger_1.default.silly(`DB_PASSWORD- ${process.env.DB_PASSWORD}`);
globalLogger_1.default.silly(`DB_URL- ${process.env.DB_URL}`);
// logger.silly(`lastReqPath: ${req.path},lastReqHeaders:${JSON.stringify(req.headers)}`)
// const sequelize = new Sequelize(
// 	process.env.DB_NAME || 'poslatest', 
// 	process.env.DB_USERNAME || 'postgres',
// 	process.env.DB_PASSWORD || 'postgres',
// 	{
// 		host: process.env.DB_URL || '3.12.128.5', 
// 		//name of db
//   	// port: 5432,
// 		dialect: 'postgres',
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000
// 		},
// 		operatorsAliases: false
// 	}
// );
// const sequelize = new Sequelize(
// 	process.env.DB_NAME || 'xyz', 
// 	process.env.DB_USERNAME || 'xyz',
// 	process.env.DB_PASSWORD || 'xyz',
// 	{
// 		host: process.env.DB_URL || 'xyz', 
// 		//name of db
//   	// port: 5432,
// 		dialect: 'postgres',
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000
// 		},
// 		operatorsAliases: false
// 	}
// );
/* clients test db kokomeshtestpos2 */
// const sequelize = new Sequelize(
// 	process.env.DB_NAME || 'kokomeshtestpos2',
// 	process.env.DB_USERNAME || 'postgres',
// 	process.env.DB_PASSWORD || 'postgres',
// 	{
// 		host: process.env.DB_URL || 'localhost',
// 		//name of db
// 		// port: 8546,  // comment port while pushing
// 		dialect: 'postgres',
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000
// 		},
// 		operatorsAliases: false
// 	}
// );
/**  clients live db liveposdb */
// const sequelize = new Sequelize(
// 	process.env.DB_NAME || 'liveposdb',
// 	process.env.DB_USERNAME || 'postgres',
// 	process.env.DB_PASSWORD || 'postgres',
// 	{
// 		host: process.env.DB_URL || 'localhost',
// 		//name of db
// 		// port: 8546,  // comment port while pushing
// 		dialect: 'postgres',
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			acquire: 30000,
// 			idle: 10000
// 		},
// 		operatorsAliases: false
// 	}
// );
const sequelize = new sequelize_1.default(process.env.DB_NAME || 'guru99', //PWSC  //test
process.env.DB_USERNAME || 'postgres', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_URL || 'localhost',
    //name of db
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});
exports.sequelize = sequelize;
const CustomerTable = sequelize.define('customercatalog', {
    customer_id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_name: { type: sequelize_1.default.STRING },
    customer_name_arabic: { type: sequelize_1.default.STRING },
    password: { type: sequelize_1.default.STRING },
    created_from: { type: sequelize_1.default.STRING },
    is_social_login: { type: sequelize_1.default.BOOLEAN },
    social_login_name: { type: sequelize_1.default.STRING },
    phone_no: { type: sequelize_1.default.STRING },
    phone_no2: { type: sequelize_1.default.STRING },
    phone_no3: { type: sequelize_1.default.STRING },
    email: { type: sequelize_1.default.STRING },
    dob: { type: sequelize_1.default.DATE },
    sex: { type: sequelize_1.default.STRING },
    is_verified: { type: sequelize_1.default.BOOLEAN, defaultValue: true },
    registration_otp: { type: sequelize_1.default.STRING },
    status: { type: sequelize_1.default.STRING } //active, deactive
});
exports.CustomerTable = CustomerTable;
const CustomerAddressTable = sequelize.define('customeraddress', {
    customer_address_id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: { type: sequelize_1.default.INTEGER },
    is_address_from_map: { type: sequelize_1.default.BOOLEAN, defaultValue: false },
    map_address: { type: sequelize_1.default.ARRAY(sequelize_1.default.JSON), defaultValue: [] },
    area_id: { type: sequelize_1.default.INTEGER },
    avenue: { type: sequelize_1.default.STRING },
    street: { type: sequelize_1.default.STRING },
    building: { type: sequelize_1.default.STRING },
    floor: { type: sequelize_1.default.STRING },
    flat: { type: sequelize_1.default.STRING },
    directions: { type: sequelize_1.default.STRING },
    block_id: { type: sequelize_1.default.INTEGER },
    address_phone_no1: { type: sequelize_1.default.STRING },
});
exports.CustomerAddressTable = CustomerAddressTable;
const complaintTable = sequelize.define('complaint', {
    complaint_id: { type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true },
    // brand_id: { type: Sequelize.INTEGER, allowNull:false },
    // branch_id: { type: Sequelize.INTEGER, allowNull:false },
    complaint_category_english: { type: sequelize_1.default.TEXT },
    complaint_category_arabic: { type: sequelize_1.default.TEXT },
    complaint_description_english: { type: sequelize_1.default.TEXT },
    complaint_description_arabic: { type: sequelize_1.default.TEXT }
});
exports.complaintTable = complaintTable;
const subcomplaintTable = sequelize.define('subcomplaint', {
    subcomplaint_id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    complaint_id: { type: sequelize_1.default.INTEGER, allowNull: false },
    subcomplaint_english: { type: sequelize_1.default.TEXT },
    subcomplaint_arabic: { type: sequelize_1.default.TEXT },
});
exports.subcomplaintTable = subcomplaintTable;
const customerComplaints = sequelize.define('customercomplaints', {
    customer_complaint_id: { type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: { type: sequelize_1.default.INTEGER },
    complaint_id: { type: sequelize_1.default.INTEGER },
    subcomplaint_id: sequelize_1.default.ARRAY(sequelize_1.default.INTEGER),
    order_id: { type: sequelize_1.default.INTEGER },
    brand_id: { type: sequelize_1.default.INTEGER },
    branch_id: { type: sequelize_1.default.INTEGER },
    notes: { type: sequelize_1.default.STRING },
    remark: { type: sequelize_1.default.STRING },
    status: { type: sequelize_1.default.STRING, defaultValue: 'raised' }
});
exports.customerComplaints = customerComplaints;
sequelize
    .authenticate()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("abc");
    const force = { force: false };
    globalLogger_1.default.info('Connection has been established successfully.');
    yield CustomerTable.sync({ force: false });
    yield complaintTable.sync({ force: false });
    yield subcomplaintTable.sync({ force: false });
    yield subcomplaintTable.belongsTo(complaintTable, { foreignKey: 'complaint_id' });
    // await complaintTable.belongsTo(BrandTable, {foreignKey: 'brand_id',onDelete: 'CASCADE'});
    // await complaintTable.belongsTo(BranchTable, {foreignKey: 'branch_id',onDelete: 'CASCADE'});
    // await CustomerTable.belongsTo(GlobalAreaTable, {foreignKey: 'area_id'});
    // await CustomerTable.belongsTo(BlockTable, {foreignKey: 'block_id'});
    yield CustomerAddressTable.sync({ force: false });
    yield CustomerAddressTable.belongsTo(CustomerTable, { foreignKey: 'customer_id' }); //new
    yield CustomerTable.hasMany(CustomerAddressTable, { foreignKey: 'customer_id' }); //new
    yield customerComplaints.sync({ force: false });
    yield customerComplaints.belongsTo(CustomerTable, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
    yield customerComplaints.belongsTo(complaintTable, { foreignKey: 'complaint_id', onDelete: 'CASCADE' });
    // await customerComplaints.hasMany(subcomplaintTable, {foreignKey: 'subcomplaint_id',onDelete: 'CASCADE'});
}))
    .catch((err) => {
    console.log("eeeeee", err);
    globalLogger_1.default.error(`Unable to connect to the database, ${err}`);
    process.exit();
});
const Op = sequelize.Sequelize.Op;
exports.Op = Op;
//# sourceMappingURL=database.js.map