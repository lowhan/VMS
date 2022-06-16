const MongoClient = require("mongodb").MongoClient;
const Admin = require("./admin"); 

//sample data  
const newsample_admin = {			   
    username : "usertest2",				// make sure this data is not exist in your mongodb 
	password : "password1",
    security_name:"secure_tan",
	security_phonenumber : "011-1111111",
}

const newsample_user = {				// new sample for register success, login success, delete success
    security_id:"secure_1",
    username : "usertest3",				// make sure this data is not exist in your mongodb 
	password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
    
}
const updatesample_user = {					// update sample for update success
	security_id : "secure_1",
    username : "usertest3",
	password : "password3",
    user_name: "user_ali",
	user_phonemumber : "999",
    role : "user",
}

const badusersample_user = {					// badusersample for login fail (invalid username)
	security_id : "secure_1",
    username : "baduser",					
	password : "password1",
    user_name:"user_ali",
	user_phonenumer : "011-1234567",
    role : "user",
}

const badpasswordsample_user = {				// badpsample for register fail, login fail (invalid password)
	security_id : "secure_1",
    username : "usertest3",				       // update fail, delete fail 
	password : "badpassword",
    user_name:"user_ali",
	user_phonenumber : "011-1234567",
    role : "user",
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Flow of the test :  																				//						   
// Start > Register success (newsample) > Register fail (badpsample) > Login success (newsample) >  //
// Login fail (badusersample) > Login fail (badpsample) > update success (updatesample) >           //
// update fail (badpsample) > delete fail (badpsample) > delete success (newsample) > End           //
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe("Admin Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.jx2e8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Admin.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

    ///////////////////////////////////////////////////////////////
					// admin : create - registration //
    test("User login - success", async () => {
		const res = await User.login(newsample_admin);
		expect(res.username).toBe(newsample.username);
		expect(res.password).toEqual(expect.any(String)); 
	})

	///////////////////////////////////////////////////////////////
					// user : create - registration //

	test("User Registration - success - new username", async () => {
		const res = await User.register(newsample_user);
		expect(res).toBe("user creation success");
	})

	test("User Registration - fail - duplicate username", async () => {
		const res = await User.register(badpasswordsample_user);
		expect(res).toBe("user creation fail");
	})

	///////////////////////////////////////////////////////////////
					// read - login & return data  //

	test("User login - success", async () => {
		const res = await User.login(newsample_user);
		expect(res.username).toBe(newsample.username);
		expect(res.password).toEqual(expect.any(String)); 
	})

	test("User login - invalid username", async () => {
		const res = await User.login(badusersample_user);
		expect(res).toBe("invalid username");
	})

	test("User login - invalid password", async () => {
		const res = await User.login(badpasswordsample_user);
		expect(res).toBe("invalid password");
	})

	///////////////////////////////////////////////////////////////
					// update - match & update //

	test("Update info - success", async () => {
		const res = await User.update(updatesample_user);
		expect(res).toBe("user update success");
	})

	test("Update info - fail", async () => {
		const res = await User.update(badpasswordsample_user);
		try 
		{
			expect(res).toBe("user update fail");     //wrong password
		}
		catch
		{
			expect(res).toBe("invalid username");  //no user found
		}
	})

	///////////////////////////////////////////////////////////////
					// delete - match & delete //

	test("Delete username - fail", async () => {
		const res = await User.delete(badpasswordsample_user);
		try 
		{
			expect(res).toBe("user deletion fail");     //wrong password
		}
		catch
		{
			expect(res).toBe("invalid username");  //no user found
		}
	})
	
	test("Delete username - success", async () => {
		const res = await User.delete(newsample_user);
		expect(res).toBe("user deletion success");
	})

	///////////////////////////////////////////////////////////////					
});