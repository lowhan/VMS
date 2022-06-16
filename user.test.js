const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

//sample data  

const sampleuser = {						// new sample for register success, login success, delete success
    _id : "62aafe1fb1082983abec82cd",
	security_id:"62aafc8472263b2a3ed6e658",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const badpassworduser = {						// new sample for register success, login success, delete success
    _id : "62aafe1fb1082983abec82cd",
	security_id:"secure_1",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "badpassword",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const samplevisitor = {				
	'visitor_name' : 'visitor1',
	'visitor_phonenumber' : '0124685214',
	'number_of_visitors' : 5,
	'room_info' : 'A102',
	'arrival_time' : '16/3/22',
	'end_time' : '16/4/22'
}

const updatedocument = {
	'visitor_id':'62ab3b290983751028fff1c6', // target visitor
	'number_of_visitors' : 2,
	'room_info' : 'A101',
	'arrival_time' : '5/1/22',
	'end_time' : '10/2/22'
}

const wrongidupdatedocument = {
	'visitor_id':'thisiddoesntexist', // target visitor
	'number_of_visitors' : 2,
	'room_info' : 'A101',
	'arrival_time' : '5/1/22',
	'end_time' : '10/2/22'
}

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

	// // user - login 
	// test("User login - success", async () => {
	// 	const res = await User.loginuser(sampleuser);
	// 	expect(res.login_username).toBe(sampleuser.login_username);
	// })

	// test("User login - invalid password", async () => {
	// 	const res = await User.loginuser(sampleuser);
	// 	expect(res).toBe("invalid password");
	// })

	// test("User login - invalid username", async () => {
	// 	const res = await User.loginuser(sampleuser);
	// 	expect(res).toBe("invalid username");
	// })

	////////////////////Create visitor//////////////////
	// test("User - Visitor creation  - success - new visitor", async () => {
	// 	const res = await User.createvistor(sampleuser,samplevisitor);
	// 	expect(res).toBe("visitor creation success");
	// })	

	// test("User - Visitor creation - fail - duplicate", async () => {
	// 	const res = await User.register(sampleuser,badpassworduser);
	// 	expect(res).toBe("visitor creation fail");
	// })

	/////////////////Update visitor//////////////////
	// test ("User - Visitor Update - success",async() =>{
	// 	const res = await User.updatevisitor(sampleuser,updatedocument);
	// 	expect(res).toBe("visitor update success");
	// })
	
	// test("User - Visitor Update - fail", async () => {
	// 	const res = await User.updatevisitor(sampleuser, wrongidupdatedocument);
	// 	try
	// 	{
	// 		expect(res).toBe("visitor update fail");
	// 	}
	// 	catch
	// 	{
	// 		expect(res).toBe("invalid username");
	// 	}	
	// })

	///////////////Delete Visitor///////////////////////
	// test("User - Visitor Deletion - fail", async () => {
	// 	const res = await User.deletevisitor(sampleuser,wrongidupdatedocument);
	// 	try
	// 	{
	// 		expect(res).toBe("visitor deletion fail");
	// 	}
	// 	catch
	// 	{
	// 		expect(res).toBe("invalid username");
	// 	}
	// })
	
	// test("User - Visitor Deletion - success", async() => {
    // const res = await User.deletevisitor(sampleuser,updatedocument);
	// expect(res).toBe("visitor deletion success");
	// })
});
