const MongoClient = require("mongodb").MongoClient;
const Admin = require("./admin"); 

//sample data  
const newsample_admin = {						// new admin sample   
    login_username : "administrator",					
	login_password : "passwordfromadministrator",
    security_name: "Charles",
	security_phonenumber : "0178956240",
}

const newsample_user = {						// new user sample
    _id : "62aafe1fb1082983abec82cd",
	security_id:"secure_1",
    login_username : "usertest3",				 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const updatesample_user = {						// update detail sample 
    user_name: "user_ali",
	user_phonenumber : "999"
}

const badusersample_user = {					// baduser sample with bad login_username
	security_id : "secure_1",
    login_username : "baduser",					
	login_password : "password1",
    user_name:"user_ali",
	user_phonenumber : "011-1234567",
    role : "user",
}

const badpasswordsample_user = {				// badpassword sample with bad login_password
	security_id : "secure_1",
    login_username : "usertest3",				
	login_password : "badpassword",
    user_name:"user_ali",
	user_phonenumber : "011-1234567",
    role : "user",
}

describe("Admin Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-students:m001-mongodb-basics@sandbox.kiupl.mongodb.net/?retryWrites=true&w=majority",				// DB for testing
			{ useNewUrlParser: true },
		);
		Admin.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	// admin
	//create
	// test("Admin create - success", async () => {
	// 	const res = await Admin.createadmin(newsample_admin);
	// 	expect(res).toBe("admin creation success");
	// })

	/////////login
    // test("Admin login - success", async () => {
	// 	const res = await Admin.loginadmin(newsample_admin);
	// 	expect(res.login_username).toBe(newsample_admin.login_username);
	// })

	////////////// read
	// test("Admin view - success", async () => {
	// 	const res = await Admin.viewuser();
	// 	expect(res).toContainEqual(expect.any(Object));
	// })

	// ///////////////////////////////////////////////////////////////
	// // user 

	/////////create 
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
	// 	const res = await Admin.updateuser(badusersample_user);
	// 	expect(res).toBe("user update success");
	// })

	// test("User Update - fail", async () => {
	// 	const res = await Admin.updateuser(badusersample_user,updatesample_user);
	// 	expect(res).toBe("invalid username");  //no user found
	// })

	//////delete - match & delete
	
	// test("User Delete - success", async () => {
	// 	const res = await Admin.deleteuser(newsample_user);
	// 	expect(res).toBe("user deletion success");
	// })			
	
	// test("User Delete - fail", async () => {
	// 	const res = await Admin.deleteuser(badusersample_user);
	// 	expect(res).toBe("invalid username");     // no user found
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
