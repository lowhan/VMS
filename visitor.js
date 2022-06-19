//////////////////main function of visitor//////////////////////
let visitors;

class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("VMS").collection("visitors");
	}

	static async visitorviewaccess(userId) {
		return await visitors.findOne({ 'user_id' : userId.user_id }).then(async visitoraccess => {
			if(visitoraccess)
			{
				return visitoraccess; // all visitors related to the user
			}
			else
			{
				return "no visitor found";
			}
		});
	}
}

module.exports = Visitor;