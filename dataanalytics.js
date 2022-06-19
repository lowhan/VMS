
let datas;

class Data {
	static async injectDB(conn) {
		datas = await conn.db("VMS").collection("visitors");
	}

	// read : print peak arrival time
    static async viewpeakarrivaltime() {
        return datas.aggregate([
            {
                $project: {
                    arrival_time: 1,
                }
            }, {
                $group: {
                    _id: '$arrival_time',
                    number_of_incoming_group_of_visitor: { $sum: 1 }
                }
            }, {
                $sort: {
                    number_of_incoming_group_of_visitor: -1,
                    _id: 1
                }
            }]).toArray().then(async arrival =>{
            return arrival;
        })
    }

    // read : print peak end time
    static async viewpeakendtime() {
        return datas.aggregate([
            {
                $project: {
                    end_time: 1
                }
            }, {
                $group: {
                    _id: '$end_time',
                    number_of_outgoing_group_of_visitor: {$sum: 1}
                }
            }, {
                $sort: {
                    number_of_outgoing_group_of_visitor: -1,
                    _id: 1
                }
            }]).toArray().then(async end =>{
            return end;
        })
    }
}

module.exports = Data;