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
	res.send('Welcome to OUR page !') // maybe u can add details at here
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// endpoint = category1/category2/.../function (function)
// category = visitor, user, admin, facility, parking
// function = create (C), view (R), update (U), delete (D)

///////////////////////////// admin /////////////////////////////
// login - admin - swagger 
// login - admin (generate token)
app.post('/admin/login', async (req,res) =>{
	const admin = await Admin.loginadmin(req.body);
	console.log('\nLogin admin:', req.body); //check in console
	if (admin == "invalid username"|| admin =='invalid password')
	{
		console.log('Login status', admin)
		return res.status(401).send("login fail")
	}
	else
	{
		res.status(200).json({
			token:generateAccessToken({
					'login_username' : admin.login_username,
					'login_password' : admin.login_password,       // from user.username
					'security_name' : admin.security_name,
					'security_phonenumber' : admin.security_phonenumber,	
					'role' : 'admin'
			})
		})
	}
})
// view - swagger 
// view (use token)
app.get('/admin/login',async(req,res) =>{
	let view = await Admin.viewadmin()
	res.send(view);
})

// create - user - swagger 
// create - user (use token)
app.post('/admin/user/create',verifyToken,async(req,res) =>{
	let admin = await Admin.createuser(req.token,req.body);
	//check in console
	console.log('\nRegister user:',req.body);
	console.log('Registration status:',admin);

	if(admin == "user creation fail")
	{
		return res.status(400).send("user creation fail")
	}
	else if (admin == "user creation success")
	{
		return res.status(200).send("user creation success")
	}
})

// view - user - swagger 
// view - user (use token)
app.get('/admin/user/login',async(req,res) =>{
	let view = await Admin.viewuser()
	res.send(view);
})


// delete - user - swagger 
// delete - user (use token)
app.delete('admin/user/delete', verifyToken, async (req, res) => {
	let admin = await Admin.deleteuser(req.user)
	console.log("\nDelete user:", req.user)
	console.log("Deletion status:", admin)

	if(admin == "invalid username")
	{
		return res.status(400).send("deletion fail")
	}
	if(admin =="user deletion success")
	{
		return res.status(200).send("user deletion success")
	}
})		

// update - user - swagger
// update - user (use token)

// view - visitor - swagger 
// view - visitor (use token)

// update - visitor - permission - swagger 
// update - visitor - permission (use token)

// update - facility - permission - swagger
// update - facility - permission (use token)

// update - parking - permission - swagger
// update - parking - permission (use token)

///////////////////////////// user /////////////////////////////

// login - user - swagger 
// login - user (generate token)

// create - visitor - swagger
// create - visitor (use token)

// update - visitor - swagger
// update - visitor (use token)

// delete - visitor - swagger
// delete - visitor (use token)

// view - visitor - swagger
// view - visitor (use token)

//

// create - facility - swagger
// create - facility (use token)

// update - facility - detail - swagger
// update - facility - detail (use token)

//

// create - parking - swagger
// create - parking (use token)

// update - parking - detail - swagger
// update - parking - detail (use token)

///////////////////////////// visitor /////////////////////////////

// view - access - swagger
// view - access (use token)

// view - facility - swagger
// view - facility (use token)

// view - parking - swagger
// view - parking (use token)

///////////////////////////// facility /////////////////////////////

// everyone can use
// view - facility - swagger
// view - facility (use token)

// user and admin can use
// delete - facility - swagger 
// delete - facility (use token)  

///////////////////////////// parking /////////////////////////////

// everyone can use
// view - parking - swagger
// view - parking (use token)

// user and admin can use
// delete - parking - swagger 
// delete - parking (use token)  

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