
let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("VMS").collection("visitors");
	}

	static async visitorviewaccess(userId) {
		return await visitors.findOne({ 'user_id' : userId.user_id }).then(async visitoraccess => 
		{
			return visitoraccess;
		});
	}
}

module.exports = Visitor;