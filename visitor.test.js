const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor");

//sample user id 
const userId = { 
	user_id:"62aafe1fb1082983abec82cd"	// will change if the user is deleted
}
describe("VMS - TDD - visitor test", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
		"mongodb+srv://m001-students:m001-mongodb-basics@sandbox.kiupl.mongodb.net/?retryWrites=true&w=majority",						// db for testing
		{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})
	afterAll(async () => {
		await client.close();
	})

	// // view - visitor access //
	// test("View visitor access - success", async () => {
	// 	const res = await Visitor.visitorviewaccess(userId);
	// 	expect(res).toEqual(expect.any(Object))
	// })
});	