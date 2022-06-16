const MongoClient = require("mongodb").MongoClient;
const Facility = require("./facility");

//sample
const token = {						// user sample
    _id : "62aafe1fb1082983abec82cd",
	security_id:"62aafc8472263b2a3ed6e658",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const badtoken = {						// bad sample
    _id : "badid",
	security_id:"bad",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}

const detail = {
    'visitor_id' : "62ab3b290983751028fff1c6", 	// insert by user
    'number_of_participants': 3,
    'facility': "gym",
}

describe("VMS - TDD - facility test", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Facility.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	///////////////////////////////////////////////////////////////
					// create - facility //

	// test("Create facility detail - success", async () => { //success
	// 	const res = await Facility.createfacility(token,detail);
	// 	expect(res).toBe("facility creation success");
	// })

    // test("Create facility detail - fail", async () => {
	// 	const res = await Facility.createfacility(token,detail);
	// 	expect(res).toBe("facility creation fail");
	// })

    ////////////////////////////////////////////////////////////////
                        // view - parking //

	// test("view facility detail - success", async () => { //success
	// 	const res = await Facility.viewfacility(token);
	// 	expect(res.number_of_participants).toEqual(expect.any(Number)); 
	// 	expect(res.user_id).toEqual(expect.any(String)); 
    //     expect(res.security_id).toEqual(expect.any(String)); 
    //     expect(res.visitor_id).toEqual(expect.any(String)); 
	// })

    // test("view facility detail - fail", async () => {  //will succeed if there is not any doc
	// 	const res = await Facility.viewfacility(badtoken);
	// 	expect(res).toBe("facility view fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// 				// update detail - parking //

	// test("Update facility detail - success", async () => {
	// 	const res = await Facility.updatefacilitydetail(token,detail);
	// 	expect(res).toBe("facility update success");
	// })

    // test("Update facility detail - fail", async () => {
	// 	const res = await Facility.updatefacilitydetail(badtoken,detail);
	// 	expect(res).toBe("facility update fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// 			// delete - parking //

    // test("delete facility- fail", async () => {
	// 	const res = await Facility.deletefacility(badtoken);
	// 	expect(res).toBe("facility deletion fail");
	// })

	test("delete facility - success", async () => {
		const res = await Facility.deletefacility(token);
		expect(res).toBe("facility deletion success");
	})
});