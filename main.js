// dependencies
const MongoClient = require("mongodb").MongoClient; // Connection to MongoDB 
const User = require("./user");	                    // Import user class
const Visitor = require("./visitor");				// Import visitor class
const Admin = require("./admin");                   // Import admin class
const Facility = require("./facility")              // Import facility class
const Parking = require("./parking")				// Import parking class
const jwt = require('jsonwebtoken');                // JWT token		

// connection
MongoClient.connect( 
	"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Admin.injectDB(client);
	Visitor.injectDB(client);
	Facility.injectDB(client);
	Parking.injectDB(client);
})

// web application framework for node.js HTTP applications
const express = require('express');
const app = express() ;
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3000; //const port = 3000

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// swagger
const option = {
	definition: {
		openapi:'3.0.0',
		info: {
			title: 'Visitor Management System',
			description: 
				'This is a simple visitor management system that can be applied on the university '+
				'student to invite their family or friend to come over here and security guard in the ' +
				'university will act as the admin of the system to control most of the functions'
			,
			servers: ["http://localhost:3000"],
		},
		components: {
			securitySchemes: {
				jwt:
				{
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					in: 'header',
				},
			},
		},
		tags:['login','general','admin','user','admin/user']
	},
	apis: ['./main.js']
};

const swaggerSpec = swaggerJsDoc(option);
console.log(swaggerSpec); // server settings

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main page

app.get('/', (req, res) => {
	res.send('Welcome to OUR page ! use /api to use swagger !') // maybe u can add details at here
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// endpoint = category1/category2/.../function (function)
// category = visitor, user, admin, facility, parking
// function = create (C), view (R), update (U), delete (D)

///////////////////////////// admin /////////////////////////////

// login - admin - swagger 
// need to type - login_username, login_password
/**
 * @swagger
 * components:
 *   schemas:
 *     token:
 *       type: object
 *       properties:
 *         token: 
 *           type: string
 *         status:
 *           type: string
 */

 /**                                
 * @swagger
 * paths:
 *   /admin/login:
 *     post:
 *       tags:
 *         - login
 *       summary: Login as admin
 *       description: "Login with an admin account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 login_username: 
 *                   type: string
 *                 login_password: 
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/token'
 *         400:
 *           description: Invalid username or password
 */

// login - admin (generate token)
app.post('/admin/login', async (req,res) =>{
	const admin = await Admin.loginadmin(req.body);
	console.log('\nLogin admin:', req.body); //check in console
	console.log('Login status:', admin)
	if (admin == "invalid username"|| admin =='invalid password')
	{
		return res.status(400).send("admin login fail")
	}
	else
	{
		res.status(200).json({
			token : generateAccessToken({
					'_id': admin._id,
					'login_username' : admin.login_username,
					'login_password' : admin.login_password,       // from user.username
					'security_name' : admin.security_name,
					'security_phonenumber' : admin.security_phonenumber,	
					'role' : 'admin'
			}),
			status : 'admin login success'
		})
	}
})

// view - swagger 
// need to type - nothing
 /**
 * @swagger
 * paths:
 *   /admin/view:
 *     get:
 *       tags:
 *         - general
 *       summary: View available admin (everyone can access)
 *       description: "View every admin account"
 *       responses:
 *         200:
 *           description: "View admin successful"
 *           content:
 *             schema:
 *               type: array
 *         401:
 *           description: "No admin exists in database"
 */

// view (use token)
app.get('/admin/view',async(req,res) =>{
	let view = await Admin.viewadmin()
	res.send(view);
})

// create - user - swagger 
// need to type - login_username, login_password, user_name, user_phonenumber
 
 /**
 * @swagger
 * paths:
 *   /admin/user/create:
 *     post:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Create user 
 *       description: "Create a new user account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 login_username: 
 *                   type: string
 *                 login_password: 
 *                   type: string
 *                 user_name:
 *                   type: string
 *                 user_phonenumber:
 *                   type: string  
 *                   example: "012-3456789"           
 *       responses:
 *         200:
 *           description: "user creation success"
 *         400:
 *           description: "user creation fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// create - user (use token)
app.post('/admin/user/create',verifyToken,async(req,res) =>{
	if(req.token.role == 'admin')
	{
		let admin = await Admin.createuser(req.token,req.body);
		console.log('\nRegister user:',req.body);
		console.log('Registration status:',admin);

		try
		{
			if(admin == "user creation fail")
			{
				return res.status(400).send("user creation fail")
			}
			else if (admin == "user creation success")
			{
				return res.status(200).send("user creation success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// view - user - swagger 
// need to type - nothing
/**
 * @swagger
 * components:
 *   schemas: 
 *     user:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         login_username:
 *           type: string
 *         user_name:
 *           type: string
 *         user_phonenumber:
 *           type: string
 *         security_id:
 *           type: string
 *         role:
 *           type: string
 */

 /**
 * @swagger
 * paths:
 *   /admin/user/view:
 *     get:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: View user 
 *       description: "View every user under a security"
 *       responses:
 *         200:
 *           description: "View user successful"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref : '#/components/schemas/user'
 *         401:
 *           description: "Unauthorized"
 */

// view - user (use token)
app.get('/admin/user/view',verifyToken,async(req,res) =>{
	if(req.token.role == 'admin')
	{
		let view = await Admin.viewuser()
		res.status(200).send(view);
	}
	else
	{
		res.status(401).send("Unauthorized");
	}
})

// delete - user - swagger 
// need to type - login_username 

/**
 * @swagger
 * paths:
 *   /admin/user/delete:
 *     delete:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Delete user (put a target user)
 *       description: "Delete a user account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 login_username: 
 *                   type: string
 *       responses:
 *         200:
 *           description: "user deletion success"
 *         400:
 *           description: "user deletion fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// delete - user (use token)
app.delete('/admin/user/delete', verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Admin.deleteuser(req.body)
		console.log("\nDelete user:", req.body)
		console.log("Deletion status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("user deletion fail")
			}
			else if(admin =="user deletion success")
			{
				return res.status(200).send("user deletion success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		

// update - user - swagger
// need to type - login_username (target), user_name , user_phonenumber

/**
 * @swagger
 * paths:
 *   /admin/user/update:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Update user (put a target user and their info)
 *       description: "Update a user account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 login_username: 
 *                   type: string
 *                 user_name:
 *                   type: string
 *                 user_phonenumber:
 *                   type: string
 *                   example: "012-3456789" 
 *       responses:
 *         200:
 *           description: "user update success"
 *         400:
 *           description: "user update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - user (use token)
app.patch('/admin/user/update',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Admin.updateuser(req.body)
		console.log("\nUpdate user:", req.body)
		console.log("Update status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("user update fail")
			}
			else if(admin =="user update success")
			{
				return res.status(200).send("user update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		

// view - visitor - swagger 
// need to type - nothing 

/**
 * @swagger
 * paths:
 *   /admin/visitor/view:
 *     get:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: View visitor 
 *       description: "View every visitor account"
 *       responses:
 *         200:
 *           description: "View visitor successful"
 *           content:
 *             schema:
 *               type: array
 *         401:
 *           description: "Unauthorised"
 */

// view - visitor (use token)
app.get('/admin/visitor/view',verifyToken ,async(req,res) =>{
	if(req.token.role == 'admin')
	{
		let view = await Admin.viewuservisitor()
		res.status(200).send(view);
	}
	else
	{
		res.status(401).send("Unauthorized");
	}
})

// update - visitor - permission - swagger 
// need to type - user_id

/**
 * @swagger
 * paths:
 *   /admin/visitor/updatepermission/{user_id}:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Update visit permission (put a user id to allow their visitor)
 *       description: "Update a visitor account"
 *       parameters:
 *         - in: path
 *           name: user_id
 *           required: true
 *           schema: 
 *             type: string
 *       responses:
 *         200:
 *           description: "visitor update permission success"
 *         400:
 *           description: "visitor update permission fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - visitor - permission (use token)
app.patch('/admin/visitor/updatepermission/:user_id',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Admin.updateuservisitor(req.params)
		console.log("\nUpdate visitor:", req.params)
		console.log("Update status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("visitor update permission fail")
			}
			else if(admin =="visitor update permission success")
			{
				return res.status(200).send("visitor update permission success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		

// update - facility - permission - swagger
// need to type - visitor_id

/**
 * @swagger
 * paths:
 *   /admin/facility/updatefacilitypermission/{user_id}:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Update facility permission (put a user_id to allow their visitor)
 *       description: "Update facility"
 *       parameters:
 *         - in: path
 *           required: true
 *           name: user_id
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: "facility permission update success"
 *         400:
 *           description: "facility permission update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - facility - permission (use token)
app.patch('/admin/facility/updatefacilitypermission/:user_id',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Facility.updatefacilitypermission(req.token,req.params)
		console.log("\nUpdate facility permission:", req.params)
		console.log("Update status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("facility permission update fail")
			}
			else if(admin =="facility permission update success")
			{
				return res.status(200).send("facility permission update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})	

// update - parking - permission - swagger
// need to type - user_id

/**
 * @swagger
 * paths:
 *   /admin/parking/updateparkingpermission/{user_id}:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin
 *       summary: Update parking permission (put a user id to allow their visitor)
 *       description: "Update parking permission"
 *       parameters:
 *         - in: path
 *           required: true
 *           name: user_id
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: "parking permission update success"
 *         400:
 *           description: "parking permission update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - parking - permission (use token)
app.patch('/admin/parking/updateparkingpermission/:user_id',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Parking.updateparkingpermission(req.token,req.params)
		console.log("\nUpdate parking permission:", req.params)
		console.log("Update status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("parking permission update fail")
			}
			else if(admin =="parking permission update success")
			{
				return res.status(200).send("parking permission update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

///////////////////////////// user /////////////////////////////

// login - user - swagger
// need to type - login_username, login_password
 /**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - login
 *     summary: Login as user
 *     description: "Login with an user account"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               login_username: 
 *                 type: string
 *               login_password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/token'
 *       400:
 *         description: Invalid username or password
 */

// login - user (generate token)
app.post('/user/login', async (req,res) =>{
	const user = await User.loginuser(req.body);
	console.log('\nLogin admin:', req.body); //check in console
	console.log('Login status:', user)
	if (user == "invalid username"|| user =='invalid password')
	{   
		console.log("user login fail")
		return res.status(400).send("user login fail")
	}
	else
	{
		res.status(200).json({
			token : generateAccessToken({
					'_id': user._id,
					'security_id' : user.security_id,
					'login_username' : user.login_username,
					'login_password' : user.login_password,       
					'user_name' : user.user_name,
					'user_phonenumber' : user.user_phonenumber,	
					'role' : user.role
			}),
			status : 'user login success'
		})
	}
})

// create - visitor - swagger
// need to type - visitor_name, visitor_phonenumber, number_of_visitors, room_info, arrival_time, end_time

/**
 * @swagger
 * paths:
 *   /user/visitor/create:
 *     post:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Create visitor 
 *       description: "Create a new visitor account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 visitor_name:
 *                   type: string
 *                 visitor_phonenumber:
 *                   type: string
 *                   example: "012-3456789" 
 *                 number_of_visitors:
 *                   type: number
 *                 room_info:
 *                   type: string
 *                   example: "Blok A-000"
 *                 arrival_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *                 end_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *       responses:
 *         200:
 *           description: "visitor creation success"
 *         400:
 *           description: "visitor creation fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// create - visitor (use token)
app.post('/user/visitor/create',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.createvisitor(req.token,req.body);
		console.log('\nRegister visitor:',req.body);
		console.log('Registration status:',user);

		try
		{
			if(user == "visitor creation fail")
			{
				return res.status(400).send("visitor creation fail")
			}
			else if (user == "visitor creation success")
			{
				return res.status(200).send("visitor creation success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - visitor - swagger
// need to type - visitor_id, visitor_name, visitor_phonenumber, number_of_visitors, room_info, arrival_time, end_time

/**
 * @swagger
 * paths:
 *   /user/visitor/update:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Update visitor (put a visitor id and their info)
 *       description: "Update a visitor account"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 visitor_name: 
 *                   type: string
 *                 visitor_phonenumber:
 *                   type: string
 *                   example: "012-3456789" 
 *                 number_of_visitors:
 *                   type: number
 *                 room_info:
 *                   type: string
 *                   example: "Blok A-000"
 *                 arrival_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *                 end_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *       responses:
 *         200:
 *           description: "visitor update success"
 *         400:
 *           description: "visitor update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */
// update - visitor (use token)
app.patch('/user/visitor/update',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.updatevisitor(req.token,req.body);
		console.log('\nUpdate visitor:',req.body);
		console.log('Update status:',user);

		try
		{
			if(user == "visitor update fail")
			{
				return res.status(400).send("visitor update fail")
			}
			else if (user == "visitor update success")
			{
				return res.status(200).send("visitor update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// delete - visitor - swagger
// need to type - visitor_id

/**
 * @swagger
 * paths:
 *   /user/visitor/delete:
 *     delete:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Delete visitor (put the visitor id)
 *       description: "Delete a visitor account"
 *       responses:
 *         200:
 *           description: "visitor deletion success"
 *         400:
 *           description: "visitor deletion fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// delete - visitor (use token)
app.delete('/user/visitor/delete',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.deletevisitor(req.token);
		console.log('\nDelete visitor by its user:',req.token._id);
		console.log('Delete status:',user);

		try
		{
			if(user == "visitor deletion fail")
			{
				return res.status(400).send("visitor deletion fail")
			}
			else if (user == "visitor deletion success")
			{
				return res.status(200).send("visitor deletion success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// view - visitor - swagger
// need to type - nothing

/**
 * @swagger
 * paths:
 *   /user/visitor/view:
 *     get:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: View visitor 
 *       description: "View their visitor only"
 *       responses:
 *         200:
 *           description: "visitor view success"
 *         400:
 *           description: "no visitor found"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// view - visitor (use token)
app.get('/user/visitor/view',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.viewvisitor(req.token);
		console.log('\nUser Id of the visitor:',req.body);
		console.log('Result:',user);

		try
		{
			if(user != "no visitor found")
			{
				return res.status(200).send(user)
			}
			else if (user == "no visitor found")
			{
				return res.status(400).send("no visitor found")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

//

// create - facility - swagger
// need to type - visitor_id, number_of_participants, facility

/**
 * @swagger
 * paths:
 *   /user/facility/create:
 *     post:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Create facility
 *       description: "Create a new facility booking"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 visitor_id:
 *                   type: string
 *                 number_of_participants:
 *                   type: number
 *                 facility:
 *                   type: string
 *       responses:
 *         200:
 *           description: "facility creation success"
 *         400:
 *           description: "facility creation fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// create - facility (use token)
app.post('/user/facility/create',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await Facility.createfacility(req.token,req.body);
		console.log('\nFacility registration:',req.body);
		console.log('Facility registration status:',user);

		try
		{
			if(user == "facility creation fail")
			{
				return res.status(400).send("facility creation fail")
			}
			else if (user == "facility creation success")
			{
				return res.status(200).send("facility creation success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - facility - detail - swagger
// need to type - number_of_participants, facility

/**
 * @swagger
 * paths:
 *   /user/facility/update:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Update facility
 *       description: "Update a facility booking"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 number_of_participants:
 *                   type: number
 *                 facility:
 *                   type: string
 *       responses:
 *         200:
 *           description: "facility update success"
 *         400:
 *           description: "facility update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - facility - detail (use token)
app.patch('/user/facility/update',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await Facility.updatefacilitydetail(req.token,req.body);
		console.log('\nFacility update:',req.body);
		console.log('Facility update status:',user);

		try
		{
			if(user == "facility update fail")
			{
				return res.status(400).send("facility update fail")
			}
			else if (user == "facility update success")
			{
				return res.status(200).send("facility update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

//

// create - parking - swagger
// need to type - visitor_id, carplate_number, parking_lot, arrival_time, end_time

/**
 * @swagger
 * paths:
 *   /user/parking/create:
 *     post:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Create parking
 *       description: "Create a new parking booking"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 visitor_id:
 *                   type: string
 *                 carplate_number:
 *                   type: string
 *                   example: "MAS-0000"
 *                 parking_lot:
 *                   type: string
 *                   example: "A-00"
 *                 arrival_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *                 end_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *       responses:
 *         200:
 *           description: "parking creation success"
 *         400:
 *           description: "parking creation fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// create - parking (use token)
app.post('/user/parking/create',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await Parking.createparking(req.token,req.body);
		console.log('\nParking registration:',req.body);
		console.log('Parking registration status:',user);

		try
		{
			if(user == "parking creation fail")
			{
				return res.status(400).send("parking creation fail")
			}
			else if (user == "parking creation success")
			{
				return res.status(200).send("parking creation success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - parking - detail - swagger
// need to type - carplate_number, parking_lot, arrival_time, end_time

/**
 * @swagger
 * paths:
 *   /user/parking/update:
 *     patch:
 *       security:
 *         - jwt: []
 *       tags:
 *         - user
 *       summary: Update parking
 *       description: "Update a parking booking"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 carplate_number:
 *                   type: string
 *                   example: "MAS-0000"
 *                 parking_lot:
 *                   type: string
 *                   example: "A-00"
 *                 arrival_time:
 *                   type: string
 *                   example: "YYYY/MM/DD-12:00"
 *                 end_time:
 *                    type: string
 *                    example: "YYYY/MM/DD-12:00"
 *       responses:
 *         200:
 *           description: "parking update success"
 *         400:
 *           description: "parking update fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// update - parking - detail (use token)
app.patch('/user/parking/update',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await Parking.updateparkingdetail(req.token,req.body);
		console.log('\nParking update:',req.body);
		console.log('Parking update status:',user);

		try
		{
			if(user == "parking update fail")
			{
				return res.status(400).send("parking update fail")
			}
			else if (user == "parking update success")
			{
				return res.status(200).send("parking update success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

///////////////////////////// visitor /////////////////////////////

// view - access - swagger - params
// need to type - user_id

/**
 * @swagger
 * paths:
 *   /visitor/view/{user_id}:
 *     get:
 *       description: Get visitor details by using user_id
 *       summary: Get visitor by user_id
 *       tags:
 *         - general
 *       parameters:
 *         - in: path
 *           name: user_id
 *           schema: 
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: "Return visitor' details"
 *         403:
 *           description: "Forbidden"
 */

// view - access
app.get('/visitor/view/:user_id', async(req,res) =>{
	let visitor = await Visitor.visitorviewaccess(req.params)
	try
	{
		return res.status(200).send(visitor);

	}
	catch(err)
	{
		return res.status(403).send(err)
	}
})


///////////////////////////// facility /////////////////////////////

// everyone can use
// view - facility - swagger
// need to type - _id (any)

/**
 * @swagger
 * paths:
 *   /facility/view/{_id}:
 *     get:
 *       tags:
 *         - general
 *       summary: View a facility's access
 *       description: "View facility access"
 *       parameters:
 *         - in: path
 *           name: _id
 *           required: true
 *           schema:
 *             type: string 
 *       responses:
 *         200:
 *           description: "Facility booking found"
 *         400:
 *           description: "No facility booking found"
 *         403:
 *           description: "Forbidden"
 */

// view - facility 
app.get('/facility/view/:_id', async(req,res) =>{
	let view = await Facility.viewfacility(req.params) // _id : target

	try
	{
		if(view == "facility view fail" )
		{
			return res.status(400).send("no facility booking found")
		}
		else
		{
			return res.status(200).send(view); 
		}
	}
	catch(err)
	{
		return res.status(403).send(err)
	}
})

// user and admin can use
// delete - facility - swagger 

// need to type - user_id

/**
 * @swagger
 * paths:
 *   /facility/delete/{user_id}:
 *     delete:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin/user
 *       summary: Delete a facility booking
 *       description: "Delete facility booking"
 *       parameters:
 *         - in: path
 *           name: user_id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: "facility delete success"
 *         400:
 *           description: "facility delete fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// delete - facility (use token)  
app.delete('/facility/delete/:user_id',verifyToken,async(req,res) =>{
	if(req.token.role == 'user'||req.token.role=='admin')
	{
		let facility = await Facility.deletefacility(req.params)
		console.log('\nFacility delete:',req.params);
		console.log('Facility delete status:',facility);

		try
		{
			if(facility == "facility deletion fail")
			{
				return res.status(400).send("facility deletion fail")
			}
			else if (facility == "facility deletion success")
			{
				return res.status(200).send("facility deletion success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

///////////////////////////// parking /////////////////////////////

// everyone can use
// view - parking - swagger
// need to type - _id (any)

/**
 * @swagger
 * paths:
 *   /parking/view/{_id}:
 *     get:
 *       tags:
 *         - general
 *       summary: View a parking's access
 *       description: "View parking access"
 *       parameters:
 *         - in: path
 *           required: true
 *           name: _id
 *           schema: 
 *             type: string
 *       responses:
 *         200:
 *           description: "Parking booking found success"
 *         400:
 *           description: "No parking booking found"
 *         403:
 *           description: "Forbidden"
 */

// view - parking 
app.get('/parking/view/:_id',async(req,res) =>{
	let view = await Parking.viewparking(req.params) // _id : target

	try
	{
		if(view == "parking view fail" )
		{
			return res.status(400).send("no parking booking found")
		}
		else
		{
			return res.status(200).send(view);
		}
	}
	catch(err)
	{
		return res.status(403).send(err)
	}
})

// user and admin can use
// delete - parking - swagger 

// need to type - user_id

/**
 * @swagger
 * paths:
 *   /parking/delete/{user_id}:
 *     delete:
 *       security:
 *         - jwt: []
 *       tags:
 *         - admin/user
 *       summary: Delete a parking booking
 *       description: "Delete parking booking"
 *       parameters:
 *         - in: path
 *           name: user_id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: "parking delete success"
 *         400:
 *           description: "parking delete fail"
 *         401:
 *           description: "Unauthorized"
 *         403:
 *           description: "Forbidden"
 */

// delete - parking (use token)  
app.delete('/parking/delete/:user_id',verifyToken,async(req,res) =>{
	if(req.token.role == 'user'||req.token.role == 'admin')
	{
		let parking = await Parking.deleteparking(req.params)
		console.log('\nParking delete:',req.params);
		console.log('Parking delete status:',parking);

		try
		{
			if(parking == "parking deletion fail")
			{
				return res.status(400).send("parking deletion fail")
			}
			else if (parking == "parking deletion success")
			{
				return res.status(200).send("parking deletion success")
			}
		}
		catch (err)
		{
			return res.status(403).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Print server on console

app.listen(port, () => {
	console.log(`Listening to the server on ${port}`)
})

///////////////////////////////jwt - authentication and authorization////////////////////////////

function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '12h'}); // set expire time duration
}

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	const token = bearerHeader && bearerHeader.split(' ')[1];
	if(token == null) 
	{
		return res.sendStatus(401);
	}
	jwt.verify(token, "my-super-secret", (err, user) => {
		if(err) 
		{
			return res.sendStatus(403);
		}
		req.token = user;		// to access the token, use this variable
		next();
	});
}
