const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

//sample data  
const updatedocument = {					// update sample for update success
						
	"visitor_phonenumber": "999999991111"
};
const token = {
	"visitor_id":"62aa1aeb6634891b999194a4",
	 "username":"user2"
};

const visitorId = {
	"_id":"62aa1aeb6634891b999194a4",
	"username":"user2",
	"visitor_phonenumber": "888888888888888"
}	
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
	////////////////////Create visitor/////////////////////////////
	// test("User Registration - success - new username", async () => {
	// const res = await User.register(newsample);
	// expect(res).toBe("creation success");
	// })	

	 //  test("User Registration - fail ", async () => {
	// 	const res = await User.register(token,detail);
	// 	expect(res).toBe("visitor creation fail");
	// })


	///////////////Delete Visitor///////////////////////
	// test("User - Visitor Deletion", async() => {
    // const res = await User.deletevisitor(token,visitorId);
	// expect(res).toBe("visitor deletion success");
	// })

	//  test("User - Visitor Deletion-fail", async () => {
	// 	const res = await User.deletevisitor(token,detail);
	// 	expect(res).toBe("visitor deletion fail");
	// })
	

	////////////////////Create visitor/////////////////////////////
	// test("User - Visitor creation",async() =>{
	// const res  = await User.createvistor(token,sample);
	// expect(res).toBe("visitor creation success");
	// })

	//  test("User - Visitor creation-fail", async () => {
	// 	const res = await User.createvisitor(token,detail);
	// 	expect(res).toBe("visitor creation fail");
	// })
	
////////////////////Update visitor/////////////////////////////
	// test ("User - Visitor Update",async() =>{
	// const res = await User.updatevisitor(token,visitorId,updatedocument)
	// expect(res).toBe("update success");
	// })
	// //test("User - Visitor View")

	//  test("User - Visitor Update-fail", async () => {
	// 	const res = await User.visitor(token,detail);
	// 	expect(res).toBe("update fail");
	// })

});
