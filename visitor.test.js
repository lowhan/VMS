const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor");

//sample user id 
<<<<<<< Updated upstream
const userId = "62a8a0a711245af602f0d323";	// will change if the user is deleted
=======
const userId = "62ada110756010477f89e51a";//"62a8a0a711245af602f0d323";
>>>>>>> Stashed changes

describe("VMS - TDD - visitor test", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
		//	"mongodb+srv://m001-student:m001-mongodb-basics@Sandbox.vqzcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		"mongodb+srv://m001-students:m001-mongodb-basics@sandbox.kiupl.mongodb.net/?retryWrites=true&w=majority",	
		{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	///////////////////////////////////////////////////////////////
	// // view - visitor access //

	// test("View visitor access - success", async () => {
	// 	const res = await Visitor.visitorviewaccess(userId);
	// 	expect(res.username).toEqual(expect.any(String)); 
	// 	expect(res.user_id).toBe(userId);
	// 	expect(res.role).toBe("visitor");
	// })

	///////////////////////////////////////////////////////////////
	// // view - facility access //

<<<<<<< Updated upstream
	// test("View facility access - success", async () => {
	// 	const res = await Visitor.visitorviewfacility(userId);
	// 	expect(res.number_of_participants).toEqual(expect.any(Number));
	// 	expect(res.user_id).toBe(userId);
	// })

	///////////////////////////////////////////////////////////////
	// // view - parking access //
=======
// 	test("View facility access - success", async () => {
// 		const res = await Visitor.visitorviewfacility(userId);
// 		expect(res.number_of_participants).toEqual(expect.any(Number));
// 		expect(res.user_id).toBe(userId);
// 	})

// 	///////////////////////////////////////////////////////////////
// 					// view - parking access //

// 	test("View parking access - success", async () => {
// 		const res = await Visitor.visitorviewparking(userId);
// 		expect(res.carplate_number).toEqual(expect.any(String)); 
// 		expect(res.user_id).toBe(userId);
// 	})
>>>>>>> Stashed changes

	// test("View parking access - success", async () => {
	// 	const res = await Visitor.visitorviewparking(userId);
	// 	expect(res.carplate_number).toEqual(expect.any(String)); 
	// 	expect(res.user_id).toBe(userId);
	// })
});