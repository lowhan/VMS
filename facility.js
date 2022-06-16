let users, facilities;

class Facility {
    static async injectDB(conn) {
		users = await conn.db("VMS").collection("users");
		facilities = await conn.db("VMS").collection("facilities");
	}

    // create facility
	static async createfacility(token,detail) {		
		return facilities.findOne({								 
				'user_id': token._id					// only can be use by user
		}).then(async facility =>{
			if (facility) 
			{
				return "facility creation fail"; 		// duplicate facility
			}
			else
			{
				await facilities.insertOne({	 			// Save user to database				
					'user_id' : token._id,
					'visitor_id' : detail.visitor_id, 
                    'security_id' : token.security_id,	// insert by user
					'number_of_participants': detail.number_of_participants,
					'facility_': detail.facility,
					'facility_access_permission': "no_access",
				})
				return "facility creation success";
			}
		})	
	}

    // view facility
	static async viewfacility(token) {				// token or detail in json (for visitor)	
		return facilities.findOne({								 
			$or : 
			[
				{ 'user_id': token._id },	
				{ 'visitor_id': token._id },
				{ 'security_id': token._id }
			]			
		}).then(async facility =>{
			if (facility) 
			{
				return facility; 					// return details
			}
			else
			{
				return "facility view fail"; 		// no details
			}
		})	
	}

    // update facility details
	static async updatefacilitydetail(token,detail) {		// token or detail in json (for visitor)	
		return facilities.findOne({								 
			'user_id': token._id					// only can be use by user
		}).then(async facility =>{
			if (facility) 
			{
				await facilities.updateOne({'user_id' : facility.user_id},{ // update user to database
					$set:{
						'visitor_id' : detail.visitor_id, 			 
						'number_of_participants': detail.number_of_participants,
						'facility': detail.facility
						
					}	 							
				})
				return "facility update success";
			}
			else
			{
				return "facility update fail"; 			// nothing to update
			}
		})	
	}

    // delete parking
	static async deletefacility(detail) {		
		return facilities.findOne({ 'user_id' : detail._id }).then(async facility =>{
			if (facility) 
			{
				await facilities.deleteOne({ 
					'_id': facility._id 
				});
				return "facility deletion success";
			}
			else
			{
				return "facility deletion fail"; 	 // nothing to delete 
			}
		})	
	}
}



module.exports = Facility;
