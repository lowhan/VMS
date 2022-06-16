const MongoClient = require("mongodb").MongoClient;
const Facility = require("./facility");

//sample
const token = {             //carrying user details
    "_id" : "user1",
    "security_id":"admin1"
}

const detail = {
    'visitor_id' : "visitor1", 	// insert by user
    'number_of_participants': "detail.number_of_participants",
    'facility': "detail.facility",
    'facility_access_permission': "no_access"
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

	//     test("Create facility detail - success", async () => { //success
	// 	const res = await Facility.createfacility(token,detail);
	// 	expect(res).toBe("facility creation success");
	// })
    //     test("Create facility detail - fail", async () => {
	// 	const res = await Facility.createfacility(token,detail);
	// 	expect(res).toBe("facility creation fail");
	// })
    ////////////////////////////////////////////////////////////////
                        // view - parking //

	// test("view facility detail - success", async () => { //success
	// 	const res = await Facility.viewfacility(token);
	// 	expect(res.number_of_participants).toEqual(expect.any(String)); 
	// 	expect(res.user_id).toEqual(expect.any(String)); 
    //     expect(res.security_id).toEqual(expect.any(String)); 
    //     expect(res.visitor_id).toEqual(expect.any(String)); 
	// })

    // test("view facility detail - fail", async () => {  //will succeed if there is not any doc
	// 	const res = await Facility.viewfacility(token,detail);
	// 	expect(res).toBe("facility view fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// 				// update detail - parking //

	// test("Update facility detail - success", async () => {
	// 	const res = await Facility.updatefacilitydetail(token,detail);
	// 	expect(res).toBe("facility update success");
	// })

    // test("Update facility detail - fail", async () => {
	// 	const res = await Facility.updatefacilitydetail(token,detail);
	// 	expect(res).toBe("facility update fail");
	// })

     // ///////////////////////////////////////////////////////////////
	// 			// delete - parking //

	// test("delete facility - success", async () => {
	// 	const res = await Facility.deletefacility(token);
	// 	expect(res).toBe("facility deletion success");
	// })

    test("delete facility- fail", async () => {
		const res = await Facility.deletefacility(detail);
		expect(res).toBe("facility deletion fail");
	})


});