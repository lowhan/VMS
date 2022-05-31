const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

//sample data  
const newsample = {						// new sample for register success, login success, delete success
	username : "usertest2",				// make sure this data is not exist in your mongodb 
	password : "passwordfromusertest2",
	phone : "011-1111111",
	role : "user",
}

const updatesample = {					// update sample for update success
	username : "usertest2",					
	password : "passwordfromusertest2",
	phone : "999",
	role : "admin",
}

const badusersample = {					// badusersample for login fail (invalid username)
	username : "baduser",					
	password : "passwordfromusertest2",
	phone : "011-1111111",
	role : "user",
}

const badpasswordsample = {				// badpsample for register fail, login fail (invalid password)
	username : "usertest2",				// update fail, delete fail 
	password : "badpassword",
	phone : "011-1111111",
	role : "user",
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Flow of the test :  																				//						   
// Start > Register success (newsample) > Register fail (badpsample) > Login success (newsample) >  //
// Login fail (badusersample) > Login fail (badpsample) > update success (updatesample) >           //
// update fail (badpsample) > delete fail (badpsample) > delete success (newsample) > End           //
//////////////////////////////////////////////////////////////////////////////////////////////////////

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

	///////////////////////////////////////////////////////////////
					// create - registration //

	test("User Registration - success - new username", async () => {
		const res = await User.register(newsample);
		expect(res).toBe("creation success");
	})

	test("User Registration - fail - duplicate username", async () => {
		const res = await User.register(badpasswordsample);
		expect(res).toBe("creation fail");
	})

	///////////////////////////////////////////////////////////////
					// read - login & return data  //

	test("User login - success", async () => {
		const res = await User.login(newsample);
		expect(res.username).toBe(newsample.username);
		expect(res.password).toEqual(expect.any(String)); 
	})

	test("User login - invalid username", async () => {
		const res = await User.login(badusersample);
		expect(res).toBe("invalid username");
	})

	test("User login - invalid password", async () => {
		const res = await User.login(badpasswordsample);
		expect(res).toBe("invalid password");
	})

	///////////////////////////////////////////////////////////////
					// update - match & update //

	test("Update info - success", async () => {
		const res = await User.update(updatesample);
		expect(res).toBe("update success");
	})

	test("Update info - fail", async () => {
		const res = await User.update(badpasswordsample);
		try 
		{
			expect(res).toBe("update fail");     //wrong password
		}
		catch
		{
			expect(res).toBe("invalid username");  //no user found
		}
	})

	///////////////////////////////////////////////////////////////
					// delete - match & delete //

	test("Delete username - fail", async () => {
		const res = await User.delete(badpasswordsample);
		try 
		{
			expect(res).toBe("deletion fail");     //wrong password
		}
		catch
		{
			expect(res).toBe("invalid username");  //no user found
		}
	})
	
	test("Delete username - success", async () => {
		const res = await User.delete(newsample);
		expect(res).toBe("deletion success");
	})

	///////////////////////////////////////////////////////////////					
});