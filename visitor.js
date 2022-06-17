
let visitors, facility, parking;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("VMS").collection("visitors");
		facility = await conn.db("VMS").collection("facility");
		parking = await conn.db("VMS").collection("parking");
	}

	static async visitorviewaccess(userId) {
		return await visitors.findOne({ 'user_id' : userId }).then(async visitoraccess => 
		{
			return visitoraccess;
		});
	}
}

module.exports = Visitor;