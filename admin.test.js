const MongoClient = require("mongodb").MongoClient;
const Admin = require("./admin"); 

//sample data  
const newsample_admin = {	
	//_id: "62aafc8472263b2a3ed6e658",	   
    login_username : "admin",				// make sure this data is not exist in your mongodb 
	login_password : "passwordfromadmin",
    security_name: "Jackson",
	security_phonenumber : "0124569562",
}

const newsample_user = {						// new sample for register success, login success, delete success
    _id : "62aafe1fb1082983abec82cd",
	security_id:"secure_1",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const updatesample_user = {					// update sample for update success
    user_name: "user_ali",
	user_phonenumber : "999"
}

const badusersample_user = {					// badusersample for login fail (invalid username)
	security_id : "secure_1",
    login_username : "baduser",					
	login_password : "password1",
    user_name:"user_ali",
	user_phonenumer : "011-1234567",
    role : "user",
}

const badpasswordsample_user = {				// badpsample for register fail, login fail (invalid password)
	security_id : "secure_1",
    login_username : "usertest3",				       // update fail, delete fail 
	login_password : "badpassword",
    user_name:"user_ali",
	user_phonenumber : "011-1234567",
    role : "user",
}

describe("Admin Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			//"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.jx2e8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Admin.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	// admin
	// create
	// test("Admin create - success", async () => {
	// 	const res = await Admin.createadmin(newsample_admin);
	// 	expect(res).toBe("admin creation success");
	// })

	// login
    // test("Admin login - success", async () => {
	// 	const res = await Admin.loginadmin(newsample_admin);
	// 	expect(res.login_username).toBe(newsample_admin.login_username);
	// })

	// read
	// test("Admin view - success", async () => {
	// 	const res = await Admin.viewuser();
	// 	expect(res).toContainEqual(expect.any(Object));
	// })

	// ///////////////////////////////////////////////////////////////
	// // user 

	// // create 
	// test("User Registration - success - new username", async () => {
	// 	const res = await Admin.createuser(newsample_admin,newsample_user);
	// 	expect(res).toBe("user creation success");
	// })

	// test("User Registration - fail - duplicate username", async () => {
	// 	const res = await Admin.createuser(newsample_admin,badpasswordsample_user);
	// 	expect(res).toBe("user creation fail");
	// })

	// // read

	// test("User view - success", async () => {
	// 	const res = await Admin.viewuser();
	// 	expect(res).toContainEqual(expect.any(Object));
	// })

	// // update - match & update

	// test("User Update - success", async () => {
	// 	const res = await Admin.updateuser(newsample_user,updatesample_user);
	// 	expect(res).toBe("user update success");
	// })

	// test("User Update - fail", async () => {
	// 	const res = await Admin.updateuser(badusersample_user,updatesample_user);
	// 	expect(res).toBe("invalid username");  //no user found
	// })

	// // delete - match & delete
	// test("User Delete - fail", async () => {
	// 	const res = await Admin.deleteuser(badusersample_user);
	// 	expect(res).toBe("invalid username");     // no user found
	// })
	
	// test("User Delete - success", async () => {
	// 	const res = await Admin.deleteuser(newsample_user);
	// 	expect(res).toBe("user deletion success");
	// })			
	
	///////////////////////////////////////////////////////////////
	// visitor

	// view
	// test("Visitor view - success", async () => {
	// 	const res = await Admin.viewuservisitor();
	// 	expect(res).toContainEqual(expect.any(Object));
	// })	

	// test("Visitor view - fail", async () => {
	// 	const res = await Admin.viewuservisitor();
	// 	expect(res).toBe("visitor view fail");
	// })	

	// // update visitor permission
	// test("Visitor update permission - success", async () => {
	// 	const res = await Admin.updateuservisitorpermission(newsample_user);
	// 	expect(res).toBe("user update permission success");
	// })

	// test("Visitor update permission - fail", async () => {
	// 	const res = await Admin.updateuservisitorpermission(badusersample_user);
	// 	expect(res).toBe("invalid username");
	// })
});
