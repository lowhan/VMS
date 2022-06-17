
let users, parkings;

class Parking {
	static async injectDB(conn) {
		users = await conn.db("VMS").collection("users");
		parkings = await conn.db("VMS").collection("parkings");
	}
	
	// create parking
	static async createparking(token,detail) {		
		return parkings.findOne({								 
				'user_id': token._id					// only can be use by user
		}).then(async parking =>{
			if (parking) 
			{
				return "parking creation fail"; 		// duplicate parking
			}
			else
			{
				await parkings.insertOne({	 			// Save user to database				
					'user_id' : token._id,
					'security_id' : token.security_id,
					'visitor_id' : detail.visitor_id, 	// insert by user
					'carplate_number': detail.carplate_number,
					'parking_lot': detail.parking_lot,
					'parking_access_permission': "no_access",
					'arrival_time': detail.arrival_time,
					'end_time': detail.end_time
				})
				return "parking creation success";
			}
		})	
	}

	// view parking
	static async viewparking(token) {				// token or detail in json (for visitor)	
		return parkings.findOne({								 
			$or : 
			[
				{ 'user_id': token.user_id },	
				{ 'visitor_id': token.user_id },
				{ 'security_id': token.user_id }
			]			
		}).then(async parking =>{
			if (parking) 
			{
				return parking; 					// return details
			}
			else
			{
				return "parking view fail"; 		// no details
			}
		})	
	}

	// update parking details
	static async updateparkingdetail(token,detail) {		// token or detail in json (for visitor)	
		return parkings.findOne({								 
			'user_id': token._id					// only can be use by user
		}).then(async parking =>{
			if (parking) 
			{
				await parkings.updateOne({'user_id' : parking.user_id},{ // update user to database
					$set:{
						'visitor_id' : detail.visitor_id, 			 
						'carplate_number': detail.carplate_number,
						'parking_lot': detail.parking_lot,
						'arrival_time': detail.arrival_time,
						'end_time': detail.end_time
					}	 							
				})
				return "parking update success";
			}
			else
			{
				return "parking update fail"; 			// nothing to update
			}
		})	
	}

	// update parking permission for admin
	static async updateparkingpermission(token,detail) {		// token = with admin role	
		return parkings.findOne({									// detail = which visitor's permission is allowed
			$and : 	
			[
				{ 'user_id': detail.user_id },
				{ 'security_id': token.security_id }
			]							
		}).then(async parking =>{
			if (parking) 
			{
				await parkings.updateOne({'user_id' : parking.user_id},{ // update user to database
					$set:{
						'parking_access_permission' : parking.parking_lot			 
					}	 							
				})
				return "parking permission update success";
			}
			else
			{
				return "parking permission update fail"; 				 // visitor_id not found @ token is not belong to admin/security
			}
		})	
	}

	// delete parking
	static async deleteparking(detail) {		
		return parkings.findOne({ 'user_id' : detail.user_id }).then(async parking =>{
			if (parking) 
			{
				await parkings.deleteOne({ 
					'_id': parking._id 
				});
				return "parking deletion success";
			}
			else
			{
				return "parking deletion fail"; 	 // nothing to delete 
			}
		})	
	}
}

module.exports = Parking;