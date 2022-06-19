const MongoClient = require("mongodb").MongoClient;
const Parking = require("./parking");

//sample data
const token = {            							 // admin token sample
    "_id" : "admin1",
	"user_id":"user1"
}

const detail = {
	'user_id':'user1',
    'visitor_id' : "visitor1", 	// insert by user
    'carplate_number': "detail.carplate_number",
    'parking_lot': "detail.parking_lot",
    'parking_access_permission': "access",
    'arrival_time': "detail.arrival_time",
    'end_time': "update_time"
}

describe("VMS - TDD - parking test", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			//"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			"mongodb+srv://m001-students:m001-mongodb-basics@sandbox.kiupl.mongodb.net/?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Parking.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	///////////////////////////////////////////////////////////////
	// // create - parking //

	// test("Create parking detail - success", async () => {
	// 	const res = await Parking.createparking(token,detail);
	// 	expect(res).toBe("parking creation success");
	// })

    // test("Create parking detail - fail", async () => {
	// 	const res = await Parking.createparking(token,detail);
	// 	expect(res).toBe("parking creation fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// // view - parking //

	// test("view parking detail - success", async () => {
	// 	const res = await Parking.viewparking(token);
	// 	expect(res.carplate_number).toEqual(expect.any(String)); 
	// 	expect(res.user_id).toEqual(expect.any(String)); 
    //     expect(res.security_id).toEqual(expect.any(String)); 
    //     expect(res.visitor_id).toEqual(expect.any(String)); 
	// })

    // test("view parking detail - fail", async () => {
	// 	const res = await Parking.viewparking(token,detail);
	// 	expect(res).toBe("parking view fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// // update detail - parking //

	// test("Update parking detail - success", async () => {
	// 	const res = await Parking.updateparkingdetail(token,detail);
	// 	expect(res).toBe("parking update success");
	// })

    // test("Update parking detail - fail", async () => {
	// 	const res = await Parking.updateparkingdetail(token,detail);
	// 	expect(res).toBe("parking update fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// // update permission - parking //

	// test("Update parking permission - success", async () => {
	// 	const res = await Parking.updateparkingpermission(token,detail);
	// 	expect(res).toBe("parking permission update success");
	// })

    // test("Update parking permission - fail", async () => {
	// 	const res = await Parking.updateparkingpermission(token,detail);
	// 	expect(res).toBe("parking permission update fail");
	// })

    // ///////////////////////////////////////////////////////////////
	// // delete - parking //

	// test("delete parking - success", async () => {
	// 	const res = await Parking.deleteparking(token);
	// 	expect(res).toBe("parking deletion success");
	// })

//     test("delete parking - fail", async () => {
// 		const res = await Parking.deleteparking(detail);
// 		expect(res).toBe("parking deletion fail");
// 	})
 });