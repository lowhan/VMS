//////////////////main function of parking//////////////////////
let users, parkings;

class Parking {
	static async injectDB(conn) {
		users = await conn.db("VMS").collection("users");
		parkings = await conn.db("VMS").collection("parkings");
	}
	
	// create parking
	static async createparking(token,detail) {		
		return parkings.findOne({								 
				'user_id': token._id					// only can be used by user
		}).then(async parking =>{
			if (parking) 
			{
				return "parking creation fail"; 		// duplicate parking
			}
			else
			{
				await parkings.insertOne({	 			// Save facility booking to database				
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
	static async viewparking(token) {					
		return parkings.findOne({								 
			$or : 
			[
				{ 'user_id': token._id },	
				{ 'visitor_id': token._id },
				{ 'security_id': token._id }
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
	static async updateparkingdetail(token,detail) {	// details = update info for the parking booking	
		return parkings.findOne({								 
			'user_id': token._id					// only can be used by user
		}).then(async parking =>{
			if (parking) 
			{
				await parkings.updateOne({'user_id' : parking.user_id},{ // update parking booking to database
					$set:{			 
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
	static async updateparkingpermission(detail) {		// token = with admin role	
		return parkings.findOne({								// detail = which visitor's permission is allowed
			'user_id': detail.user_id 		
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
				return "parking permission update fail"; 	// nothing to update
			}
		})	
	}

	// delete parking
	static async deleteparking(detail) {		 // detail = user_id
		return parkings.findOne({ 
			'user_id' : detail.user_id 
		}).then(async parking =>{
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