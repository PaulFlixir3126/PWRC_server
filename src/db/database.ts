import logger from '../lib/globalLogger';
import Sequelize from 'sequelize';

logger.silly(`DB_NAME- ${process.env.DB_NAME}`)
logger.silly(`DB_USERNAME- ${process.env.DB_USERNAME}`)
logger.silly(`DB_PASSWORD- ${process.env.DB_PASSWORD}`)
logger.silly(`DB_URL- ${process.env.DB_URL}`)
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



const sequelize = new Sequelize(
	process.env.DB_NAME || 'guru99',  //PWSC  //test
	process.env.DB_USERNAME || 'postgres',
	process.env.DB_PASSWORD || 'postgres',
	{
		host: process.env.DB_URL || 'localhost', //'3.92.189.126'
		//name of db
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		operatorsAliases: false
	},
);


const CustomerTable = sequelize.define('customercatalog', {
	customer_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	customer_name: { type: Sequelize.STRING },
	customer_name_arabic: { type: Sequelize.STRING },
	password:{type: Sequelize.STRING},
	created_from:{type: Sequelize.STRING},
	is_social_login:{type:Sequelize.BOOLEAN},
	social_login_name:{type:Sequelize.STRING},
	phone_no: { type: Sequelize.STRING },
	phone_no2: { type: Sequelize.STRING },
	phone_no3: { type: Sequelize.STRING },
	email: {type: Sequelize.STRING},
	dob:{type: Sequelize.DATE},
	sex:{type: Sequelize.STRING},
	is_verified:{type:Sequelize.BOOLEAN, defaultValue:true},
	registration_otp:{type: Sequelize.STRING},
	status:{type:Sequelize.STRING} //active, deactive
});

const CustomerAddressTable = sequelize.define('customeraddress', {
	customer_address_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	customer_id:{type: Sequelize.INTEGER},
	is_address_from_map:{type: Sequelize.BOOLEAN, defaultValue:false},
	map_address:{type: Sequelize.ARRAY(Sequelize.JSON), defaultValue: []},
	area_id: { type: Sequelize.INTEGER },
	avenue: { type: Sequelize.STRING },
	street: { type: Sequelize.STRING },
	building: { type: Sequelize.STRING },
	floor: { type: Sequelize.STRING },
	flat: { type: Sequelize.STRING },
	directions: { type: Sequelize.STRING },
	block_id:{type: Sequelize.INTEGER},
	address_phone_no1: { type: Sequelize.STRING },
});

const complaintTable = sequelize.define('complaint', {
	complaint_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	// brand_id: { type: Sequelize.INTEGER, allowNull:false },
	// branch_id: { type: Sequelize.INTEGER, allowNull:false },
	complaint_category_english: { type: Sequelize.TEXT },
	complaint_category_arabic: { type: Sequelize.TEXT },
	complaint_description_english: { type: Sequelize.TEXT  },
	complaint_description_arabic: { type: Sequelize.TEXT  }
});

const subcomplaintTable = sequelize.define('subcomplaint', {
	subcomplaint_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	complaint_id: { type: Sequelize.INTEGER ,allowNull:false},
	subcomplaint_english: { type: Sequelize.TEXT },
	subcomplaint_arabic: { type: Sequelize.TEXT },
});

const customerComplaints = sequelize.define('customercomplaints',{
	customer_complaint_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	customer_id: { type: Sequelize.INTEGER },
	complaint_id: { type: Sequelize.INTEGER },
	subcomplaint_id: Sequelize.ARRAY(Sequelize.INTEGER),
	order_id: { type: Sequelize.INTEGER },
	brand_id:{ type: Sequelize.INTEGER },
	branch_id:{ type: Sequelize.INTEGER },
	notes:{type: Sequelize.STRING},
	remark:{type: Sequelize.STRING},
	status:{type: Sequelize.STRING, defaultValue:'raised'}
})


sequelize
	.authenticate()
	.then(async () => {
		console.log("abc")
		const force = { force: false };

		logger.info('Connection has been established successfully.');



		await CustomerTable.sync({ force: false });
		await complaintTable.sync({ force: false });
		await subcomplaintTable.sync({force:false});
		await subcomplaintTable.belongsTo(complaintTable, {foreignKey: 'complaint_id'});
		// await complaintTable.belongsTo(BrandTable, {foreignKey: 'brand_id',onDelete: 'CASCADE'});
		// await complaintTable.belongsTo(BranchTable, {foreignKey: 'branch_id',onDelete: 'CASCADE'});
		// await CustomerTable.belongsTo(GlobalAreaTable, {foreignKey: 'area_id'});
		// await CustomerTable.belongsTo(BlockTable, {foreignKey: 'block_id'});
		await CustomerAddressTable.sync({ force: false });
		await CustomerAddressTable.belongsTo(CustomerTable, {foreignKey: 'customer_id'}); //new
		await CustomerTable.hasMany(CustomerAddressTable, { foreignKey: 'customer_id' }); //new
		await customerComplaints.sync({ force: false });
		await customerComplaints.belongsTo(CustomerTable, {foreignKey: 'customer_id',onDelete: 'CASCADE'});
		await customerComplaints.belongsTo(complaintTable, {foreignKey: 'complaint_id',onDelete: 'CASCADE'});
		// await customerComplaints.hasMany(subcomplaintTable, {foreignKey: 'subcomplaint_id',onDelete: 'CASCADE'});
	})
	.catch((err: any) => {
		console.log("eeeeee",err)
		logger.error(`Unable to connect to the database, ${err}`);
		process.exit();
	});

const Op = sequelize.Sequelize.Op;

export {

	sequelize,
	Sequelize,
	Op,
	CustomerTable,
	complaintTable,
	customerComplaints,
	subcomplaintTable,
	CustomerAddressTable,
};