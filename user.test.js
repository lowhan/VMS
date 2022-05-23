const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

//sample data
const username = "baduser"				//change name from 1 to 3	//user1 , passwordfromuser1	 											
const password = "badpassword"

describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	// test("New user registration", async () => {
	// 	const res = await User.register(username, password)
	// 	expect(res).toBe("new user created");
	// })

	// test("Duplicate username", async () => {
	// 	const res = await User.register(username, password)
	// 	expect(res).toBe("user exist");
	// })

	test("User login invalid username", async () => {
		const res = await User.login(username, password)
		expect(res).toBe("invalid username");
	})

	// test("User login invalid password", async () => {
	// 	const res = await User.login(username, password)
	// 	expect(res).toBe("invalid password");
	// })

	// test("User login successfully", async () => {
	// 	const res = await User.login(username, password)
	// 	expect(res.username).toBe(username);
	// 	expect(res.password).toEqual(expect.any(String)); //it already encrypt so... test can't expect it
	// })

});