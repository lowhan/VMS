// Connection to MongoDB 
const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
MongoClient.connect( 
	"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

// web application framework for node.js HTTP applications
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

///////////////////////////////////////////////////////////////
//jwt
const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h'});
}

app.use((req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(token == null) return res.sendStatus(401);

	jwt.verify(token, "my-super-secret", (err, user) => {
		if(err) return res.sendStatus(403);
		req.user = user;
		next();
	});
})

///////////////////////////////////////////////////////////////
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
// post + read

app.post('/user/login', async (req, res) => {								
	const user = await User.login(req.body);
	//check in console
	console.log('\nLogin user:', req.body);

	if(user == "invalid username" || user == "invalid password")
	{
		console.log('Login status:', user)
		return res.status(400).send("login fail")
	}
	else
	{
		console.log('Login detail:', user)
		res.status(200).json({
			_id : user._id,
			username : user.username,
			phone : user.phone,
			token : generateAccessToken({ username: user.username, role: 'admin' })
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

app.delete('/user/delete', async (req, res) => {
	let user = await User.delete(req.body)
	console.log("\nDelete user:", req.body)
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

app.patch('/user/update', async (req, res) => {
	let user = await User.update(req.body)
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

app.get('/user', async (req, res) => {
	let view = await User.view()
	res.send(view);		
})

app.get('/user/login', async (req, res) => {
	res.send(
		"To Login and view the user's details, please enter username and password in JSON format"
	)		
})

app.get('/user/register', async (req, res) => {
	res.send(
		"To create new user, please enter username, password, phone and role in JSON format"
	)	
})

app.get('/user/delete', async (req, res) => {
	res.send(
		"To delete the user, please enter username and password in JSON format"
	)	
})

app.get('/user/update', async (req, res) => {
	res.send(
		"To update an user, please enter username and password with their updating info (eg. phone) in JSON format"
	)	
})

///////////////////////////////////////////////////////////////

/** 
 * @swagger
 * /visitor/{id}:
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

app.get('/visitor/:id', async (req, res) =>{
})

///////////////////////////////////////////////////////////////
//JWT

app.get('/user/admin', async (req,res) =>{
	console.log(req.body.role);

	if(req.user.role == 'admin')
		res.status(200).send('You are admin')
	else
		res.status(403).send('You are not admin')
})

///////////////////////////////////////////////////////////////
// Print server on console

app.listen(port, () => {
	console.log(`Listening to the server on ${port}`)
})

///////////////////////////////////////////////////////////////
// 200 = OK, 201 = created
// 400 = bad request, 404 = Not found
///////////////////////////////////////////////////////////////


