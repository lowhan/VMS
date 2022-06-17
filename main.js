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
	//"mongodb+srv://m001-students:m001-mongodb-basics@sandbox.kiupl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
const express = require('express')
const app = express() 
const port = process.env.PORT || 3000 //const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi:'3.0.0',
		info: {
			title:'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
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

/**
 * @swagger
 * components:
 *   schemas:
 *     token:
 *       type: object
 *       properties:
 *         token: 
 *           type: string
 */

 /**
 * @swagger
 * /admin/login:
 *   post:
 *     description: "Login with an admin account"
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
 *       401:
 *         description: Invalid username or password
 */

// login - admin (generate token)
app.post('/admin/login', async (req,res) =>{
	const admin = await Admin.loginadmin(req.body);
	console.log('\nLogin admin:', req.body); //check in console
	if (admin == "invalid username"|| admin =='invalid password')
	{
		console.log('Login status', admin)
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

 /**
 * @swagger
 * /admin/view:
 *   get:
 *     description: "View every admin account"
 *     responses:
 *       200:
 *         description: "View admin successful"
 *         content:
 *           schema:
 *             type: array
 *       401:
 *         description: "No admin exists in database"
 */

// view (use token)
app.get('/admin/view',async(req,res) =>{
	let view = await Admin.viewadmin()
	res.send(view);
})



// create - user - swagger 
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// view - user - swagger 
// view - user (use token)
app.get('/admin/user/view',async(req,res) =>{
	let view = await Admin.viewuser()
	res.send(view);
})

// delete - user - swagger 
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
				return res.status(400).send("deletion fail")
			}
			else if(admin =="user deletion success")
			{
				return res.status(200).send("user deletion success")
			}
		}
		catch (err)
		{
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		

// update - user - swagger
// update - user (use token)

app.patch('/admin/user/update',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Admin.updateuser(req.token,req.body)
		console.log("\nUpdate user:", req.body)
		console.log("Updation status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("user updation fail")
			}
			else if(admin =="user update success")
			{
				return res.status(200).send("user update success")
			}
		}
		catch (err)
		{
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		



// view - visitor - swagger 
// view - visitor (use token)
app.get('/admin/visitor/view',async(req,res) =>{
	let view = await Admin.viewuservisitor()
	res.send(view);
})

// update - visitor - permission - swagger 
// update - visitor - permission (use token)
app.patch('/admin/visitor/updatepermission',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Admin.updateuservisitor(req.body)
		console.log("\nUpdate visitor:", req.body)
		console.log("Updation status:", admin)

		try
		{
			if(admin == "invalid username")
			{
				return res.status(400).send("visitor updation fail")
			}
			else if(admin =="user update permission success")
			{
				return res.status(200).send("user update permission success")
			}
		}
		catch (err)
		{
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})		

// update - facility - permission - swagger
// update - facility - permission (use token)
app.patch('/admin/facility/updatefacilitypermission',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Facility.updatefacilitypermission(req.token,req.body)
		console.log("\nUpdate facility permission:", req.body)
		console.log("Updation status:", admin)

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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})	

// update - parking - permission - swagger
// update - parking - permission (use token)
app.patch('/admin/parking/updateparkingpermission',verifyToken, async (req, res) => {
	if(req.token.role == 'admin')
	{
		let admin = await Parking.updateparkingpermission(req.token,req.body)
		console.log("\nUpdate parking permission:", req.body)
		console.log("Updation status:", admin)

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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

///////////////////////////// user /////////////////////////////

// login - user - swagger 
// login - user (generate token)
app.post('/user/login', async (req,res) =>{
	const user = await User.loginuser(req.body);
	console.log('\nLogin admin:', req.body); //check in console
	if (user == "invalid username"|| user =='invalid password')
	{
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
	console.log('Login status', user)
})

// create - visitor - swagger
// create - visitor (use token)
app.post('/user/visitor/create',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.createvisitor(req.token,req.body);
		console.log('\nRegister visitor:',req.body);
		console.log('Registration status:',user);

		try
		{
			if(user == "user creation fail")
			{
				return res.status(400).send("visitor creation fail")
			}
			else if (user == "user creation success")
			{
				return res.status(200).send("visitor creation success")
			}
		}
		catch (err)
		{
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - visitor - swagger
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// delete - visitor - swagger
// delete - visitor (use token)
app.delete('/user/visitor/delete',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.deletevisitor(req.token,req.body);
		console.log('\nDelete visitor:',req.body);
		console.log('Delete status:',user);

		try
		{
			if(user == "visitor deletion fail" || user == "invalid username")
			{
				return res.status(400).send("visitor deletion fail")
			}
			else if (user == "visitor update success")
			{
				return res.status(200).send("visitor deletion success")
			}
		}
		catch (err)
		{
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// view - visitor - swagger
// view - visitor (use token)
app.get('/user/visitor/view',verifyToken,async(req,res) =>{
	if(req.token.role == 'user')
	{
		let user = await User.viewvisitor(req.body);
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

//

// create - facility - swagger
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - facility - detail - swagger
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

//

// create - parking - swagger
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

// update - parking - detail - swagger
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
			return res.status(404).send(err)
		}
	}
	else
	{
		return res.status(401).send("Unauthorized")
	}
})

///////////////////////////// visitor /////////////////////////////

// view - access - swagger
// view - access

app.get('/visitor/view', async(req,res) =>{
	let visitor = await Visitor.visitorviewaccess(req.body)

	try
	{
		res.status(200).send(visitor);
	}
	catch(err)
	{
		return res.status(404).send(err)
	}
})


///////////////////////////// facility /////////////////////////////

// everyone can use
// view - facility - swagger
// view - facility (use token)
app.get('/facility/view',verifyToken,async(req,res) =>{
	let view = await Facility.viewfacility(req.token)

	try
	{
		res.status(200).send(view);
	}
	catch(err)
	{
		return res.status(404).send(err)
	}
})

// user and admin can use
// delete - facility - swagger 
// delete - facility (use token)  
app.delete('/facility/delete',verifyToken,async(req,res) =>{
	if(req.token.role == 'user'||req.token.role=='admin')
	{
		let facility = await Facility.deletefacility(req.body)
		console.log('\nFacility delete:',req.body);
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
			return res.status(404).send(err)
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
// view - parking (use token)
app.get('/parking/view',verifyToken,async(req,res) =>{
	let view = await Parking.viewparking(req.token)

	try
	{
		res.status(200).send(view);
	}
	catch(err)
	{
		return res.status(404).send(err)
	}
})

// user and admin can use
// delete - parking - swagger 
// delete - parking (use token)  
app.delete('/parking/delete',verifyToken,async(req,res) =>{
	if(req.token.role == 'user'||req.token.role == 'admin')
	{
		let parking = await Parking.deleteparking(req.body)
		console.log('\nParking delete:',req.body);
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
			return res.status(404).send(err)
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
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h'}); // set expire time duration
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

///////////////////////////////////////////////////////////////////////////////////
// 200 = OK, 201 = created														 //
// 400 = bad request, 401 = authorization fail, 403 = forbidden, 404 = Not found //
///////////////////////////////////////////////////////////////////////////////////