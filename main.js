const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

//web application framework for node.js HTTP applications
const express = require('express')
const app = express()
const port = process.env.PORT || 3000    //for localhost: const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//testing
app.get('/', (req, res) => {
	res.send('Welcome to OUR page !')
})

app.get('/test', (req, res) => {
	res.send('testing... you are good for now')
})

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
 * /login:
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
 */

//do http://localhost:3000/login to login the user 
app.post('/login', async (req, res) => {

	const user = await User.login(req.body.username, req.body.password);

	console.log('\nLogin user:', req.body); //check in console;
	console.log('Login status:', user);

	if(user == "invalid username" || user == "invalid password")
	{
		return res.status(400).send("login fail")
	}
	else if(user)
	{
		return res.status(200).json({
			username: req.body.username,
			password: req.body.password
		})
	}
})
app.get('/login', async (req, res) => {
	res.end('Login operation is done')		//end = json = send
})



//do http://localhost:3000/register to register the user 
app.post('/register', async (req, res) => {
	var user = await User.register(req.body.username, req.body.password);

	console.log('\nRegister user:',req.body);
	console.log('Registration status:', user);

	if(user == "user exist")
	{
		return res.status(400).send("register fail")
	}
	else if(user == "new user created")
	{
		return res.status(200).json({
			username: req.body.username,
			password: req.body.password
		})
	}
})

app.get('/register', async (req, res) => {
	res.end('Register operation is done')
})

app.listen(port, () => {
	console.log(`Listening to the server on ${port}`)
})
