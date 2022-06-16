
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

	static async visitorviewfacility(userId) {
		return await facility.findOne({ 'user_id' : userId }).then(async facilityaccess => 
		{
			return facilityaccess;
		});
	}

	static async visitorviewparking(userId) {
		return await parking.findOne({ 'user_id' : userId }).then(async parkingaccess => 
		{
			return parkingaccess;
		});
	}
}

module.exports = Visitor;