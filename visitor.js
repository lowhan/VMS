
let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("VMS").collection("visitors")
	}

	static async getbyid(visitorId) {
		return await visitors.findOne({ 'user_id' : visitorId }).then(async visitor => {
			return visitor});
	}

}

module.exports = Visitor;