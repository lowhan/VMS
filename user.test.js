const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

//sample data  
const updatedocument = {					// update sample for update success
	"username" : "usertest2",					
	"visitor_phonenumber": "999999991111"
};
const token = {
	"visitor_id":"62aa1aeb6634891b999194a4",
	 "username":"user2"
};

const visitorId = {
	"_id":"62aa1aeb6634891b999194a4",
	"username":"user2"
};
const sample = {
		'username' : 'user2',
		'phone' : '011-111111',
		'role' : 'visitor',
		'user_id' :'62a8a0a711245af602f0d323'
};

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
	
	// test("User Registration - success - new username", async () => {
	// const res = await User.register(newsample);
	// expect(res).toBe("creation success");
	// })	
	
	// test("User - Visitor Deletion", async() => {
    // const res = await User.deletevisitor(token,visitorId);
	// expect(res).toBe("visitor deletion success");
	// })

	// test("User - Visitor creation",async() =>{
	// const res  = await User.createvistor(token,sample);
	// expect(res).toBe("visitor creation success");
	// })

	test ("User - Visitor Update",async() =>{
	const res = await User.updatevisitor(token,visitorId,updatedocument)
	expect(res).toBe("update success");
	})
	//test("User - Visitor View")

});
