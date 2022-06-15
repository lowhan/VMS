
const MongoClient = require("mongodb").MongoClient; // Connection to MongoDB 
const User = require("./user");	                    // Import user class
const Visitor = require("./visitor");				// Import visitor class
const Admin = require("./admin");                   // Import admin class
const jwt = require('jsonwebtoken');                // JWT token		

MongoClient.connect( 
	"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Visitor.injectDB(client);
})

// web application framework for node.js HTTP applications
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
	apis: ['./main.js'], //files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/////////////////////////////////////////////////////////////
//user login
/**
 * @swagger
 * /user/login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string 
 *         phone:
 *           type: string  
 */

///////////////////////////////////////////////////////////////
// Testing

app.get('/', (req, res) => {
	res.send('Welcome to OUR page !')
})

app.get('/test', (req, res) => {
	res.send('testing... you are good for now')
})

///////////////////////////////////////////////////////////////
// view users (aggregation)
app.get('/user', async (req, res) => {
	let view = await User.view()
	res.send(view);		
})

///////////////////////////////////////////////////////////////
// login

app.post('/user/login', async (req, res) => {								
	const user = await User.login(req.body);
	console.log('\nLogin user:', req.body); //check in console
	if(user == "invalid username" || user == "invalid password")
	{
		console.log('Login status:', user)
		return res.status(401).send("login fail")
	}
	else
	{
		res.status(200).json({
			token : generateAccessToken({ //Token will carry the info for 30s and will be used to access the API
				_id : user._id,
				username : user.username,
				password : user.password,
				phone : user.phone, 
				role : user.role
			})
		})	
	}
})

///////////////////////////////////////////////////////////////
// post + create

app.post('/user/register', async (req, res) => { 							
	let user = await User.register(req.body);
	//check in console
	console.log('\nRegister user:',req.body);
	console.log('Registration status:',user);

	if(user == "creation fail")
	{
		return res.status(400).send("creation fail")
	}
	if(user == "creation success")
	{
		return res.status(200).send("creation success")
	}
})
												
///////////////////////////////////////////////////////////////	
//delete

app.delete('/user/delete', verifyToken, async (req, res) => {
	let user = await User.delete(req.user)
	console.log("\nDelete user:", req.user)
	console.log("Deletion status:", user)

	if(user == "deletion fail" || user == "invalid username")
	{
		return res.status(400).send("deletion fail")
	}
	if(user == "deletion success")
	{
		return res.status(200).send("deletion success")
	}
})		

///////////////////////////////////////////////////////////////
// patch + update

app.patch('/user/update',verifyToken, async (req, res) => {
	let user = await User.update(req.user,req.body)
	console.log("\nUpdate user:", req.body)
	console.log("Update status:", user)

	if(user == "update fail" || user == "invalid username")
	{
		return res.status(400).send("update fail")
	}
	if(user == "update success")
	{
		return res.status(200).send("update success")
	}
})

///////////////////////////////////////////////////////////////
// get	//end = json = send

app.get('/user/login',verifyToken, async (req, res) => {
	console.log(req.user);
		
	res.json({
		"username": req.user.username,
		"phone": req.user.phone,
		"role": req.user.role
	})
})

app.get('/user/format', async (req, res) => {
	res.send(
		"To login an existing user, please enter username and password in JSON format\n" +
		"To create new user, please enter username, password and phone in JSON format\n" +
		"To delete the user, use /user/delete endpoint after login\n" +
		"To update an user, use /user/update endpoint after login with their updating info (eg. phone) in JSON format"
	)	
})

///////////////////////////////////////////////////////////////
// i dont know

app.get('/user/admin', verifyToken, async (req,res) =>{
	if(req.user.role == 'admin')
		res.status(200).send('You are admin')
	else
		res.status(403).send('You are not admin')
})

///////////////////////////////////////////////////////////////

/** 
 * @swagger
 * /user/visitor/{id}:
 *   get:
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: visitor id
*/
///////////////////////////////////////////////////////////////

app.get('/user/visitor/:id',verifyToken, async (req, res) =>{
	//console.log(req.params);
	//console.log(req.user);
	if(req.user.role == 'user')
	{
		let visitor = await Visitor.getbyid(req.params.id);
		if (visitor)
			res.status(200).json(visitor)
		else
			res.status(404).send("Invalid Visitor Id");
	} else {
		res.status(403).send('Unauthorized')
	}
})

///////////////////////////////////////////////////////////////
// user + visitor 

// register
app.post('/user/visitor/register',verifyToken, async (req, res) => { 							
	let visitor = await User.createvistor(req.user,req.body);
	//check in console
	console.log('\nRegister user:',req.body);
	console.log('Registration status:',visitor);

	if(visitor == "visitor creation fail")
	{
		return res.status(400).send("visitor creation fail")
	}
	if(visitor == "visitor creation success")
	{
		return res.status(200).send("visitor creation success")
	}
})

///////////////////////////////////////////////////////////////
// Print server on console

app.listen(port, () => {
	console.log(`Listening to the server on ${port}`)
})

///////////////////////////////////////////////////////////////
// 200 = OK, 201 = created
// 400 = bad request, 401 = authorization fail, 403 = forbidden, 404 = Not found
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//jwt - authentication and authorization

function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h'});
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
		req.user = user;
		next();
	});
}