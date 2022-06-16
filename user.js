//////////////////main function of user//////////////////////
let users, visitors;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
var encrypt;
////////////////////////////////////////////////////////////

class User {
	static async injectDB(conn) {
		users = await conn.db("VMS").collection("users");
		visitors = await conn.db("VMS").collection("visitors");
	}
	////////////////////////////////////////////////////////////
	//CRUD = create, read, update, delete
	////////////////////////////////////////////////////////////
	
	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 * @param {*} role
	 */	

	// //create
	// static async register(sample) {		
	// 	//Hash password	
	// 	bcrypt.genSalt(saltRounds, function (saltError, salt) {  
	// 		if (saltError) 
	// 		{
	// 			throw saltError
	// 		} 
	// 		else 
	// 		{
	// 			bcrypt.hash(sample.password, salt, function(hashError, hash) 
	// 			{  
	// 				if (hashError) 
	// 				{
	// 			  		throw hashError
	// 				} 
	// 				else 
	// 				{
	// 					encrypt = hash;
	// 				}
	// 			})
	// 		}
	// 	});
	// 	//registration
	// 	return users.findOne({		//Check if username exists						 
	// 			'username': sample.username			
	// 	}).then(async user =>{
	// 		if (user) 
	// 		{
	// 			if (user.username == sample.username)
	// 			{
	// 				return "creation fail";
	// 			}
	// 		}
	// 		else
	// 		{
	// 			await users.insertOne({	 //Save user to database				
	// 				'username' : sample.username,
	// 				'password' : encrypt,
	// 				'phone' : sample.phone,
	// 				'role' : 'user'
	// 			})
	// 			return "creation success";
	// 		}
	// 	})	
	// }

	////////////////////////////////////////////////////////////
	// read 
	static async login(sample) { 											
		return users.findOne({		//Check if username exists							
				'username': sample.username				
		}).then(async user =>{
			if (user) // Validate username
			{ 
				const PasswordValid = await bcrypt.compare(sample.password, user.password)	// Validate password	 
				if (PasswordValid == false) 
				{
					return "invalid password";
				}
				else
				{
					return user; // Return user object
				}
			}
			else // If user doesn't exists
			{
				return "invalid username";
			}
		})
	}

	// // read : print user
	// static async view() {
	// 	return users.aggregate([{
	// 		$project:
	// 		{
	// 			'_id':0,
	// 			'username':1,
	// 			'phone':1
	// 		}
	// 	}]).toArray().then(async user =>{
	// 		return user;
	// 	})
	// }

	////////////////////////////////////////////////////////////																	
	//delete
	static async delete(sample) {	// Only delete when username and password are matched
		return users.findOne({								
			'username': sample.username				
		}).then(async user =>{
			if (user) // Validate username
			{ 			
				console.log(user);
				//const PasswordValid = await bcrypt.compare(user.password,sample.password) // Validate password	
				if (sample.password != user.password) 
				{ 
					return "deletion fail";
				}
				else
				{
					await users.deleteOne({'username': sample.username});
					return "deletion success";
				}
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}

	////////////////////////////////////////////////////////////
	//update
	static async update(sample, updatedoc) {	// Only update when username and password are matched
		return users.findOne({								
			'username': sample.username				
		}).then(async user =>{
			if (user) // Validate username
			{ 			
				//const PasswordValid = await bcrypt.compare(sample.password, user.password) // Validate password		 
				if (sample.password != user.password) 
				{ 
					return "update fail";
				}
				else
				{
					await users.updateOne(	
						{ // Target to change
							'username' : sample.username 
						}
						, 
						{ // Value to change
							'$set' : { 'phone' : updatedoc.phone,
									   'role'  : updatedoc.role
						 	} 
						}		   
					);
					return "update success";
				}
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}

	////////////////////////////////////////////////////////////
	// create visitor
	static async createvistor(user,visitor) {	// Only delete when username and password are matched 
		return visitors.insertOne({	
			'user_id' : user._id,
			'security_id':user.security_id,
			'visit_permission':'no access',
			'visitor_name':visitor.visitor_name,
			'visitor_phonenumber' : visitor.visitor_phonenumber,
			'number_of_visitors':visitor.number_of_visitors,
			'room_info': user.room_info,
			'arrival_time': user.arrival_time,
			'end_time': user.end_time
		}).then(async res =>{
			if (res) 
			{ 	
				await users.updateOne(	
				{
					'username' : user.username 
				}
				, 
				{ 
					'$set' : { 
						'visitor_id' : res.insertedId.toString()
					} 
				});		
				return "visitor creation success";
			}
			else 
			{
				return "visitor creation fail";
			} 
		})
	}
	////////////////////////////////////////////////////////
	//delete visitor
	static async deletevisitor(token,detail) {	// (visitor and users)Only delete when username and password are matched
		return visitors.findOne({								
			//'visitor_name': detail.visitor_name,
			'user_id': token._id		
		}).then(async visitor =>{
			if (visitor) // Validate username
			{ 			
				console.log(visitor);
				//console.log(user);
				//const PasswordValid = await bcrypt.compare(user.password,sample.password) // Validate password	
				//the user.visitor_if is not mathc with visitor_id
				console.log(token.visitor_id);
				console.log(visitor._id.toString());
				if (visitor._id != token.visitor_id) 
				{ 
					return "visitor deletion fail";
				}
				else
				{
					await visitors.deleteOne({'_id':visitor._id});
					return "visitor deletion success";
				}
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}
///////////////////////////////////////////////////////////////////////////////////////////////
//Update Visitor

static async updatevisitor(token,detail,updatedocument) {	// Only update when username and password are matched
	console.log(token);
	console.log(token.visitor_id);
	console.log(detail.username);
	console.log(detail._id);
	return visitors.findOne({		
		//'_id':token.visitor_id	
		//'user_id': token._id
		'visitor_name': token.visitor_name
		//'username': token.username//detail._id				
	}).then(async visitor =>{
		if (visitor) // Validate username
		{ 		
			//const PasswordValid = await bcrypt.compare(sample.password, user.password) // Validate password		 
			if (visitor._id != token.visitor_id) 
			{ 
				return "update fail";
			}
			else
			{
				await visitors.updateOne(	
					{ // Target to change
						'visitor_phonenumber' : visitor.visitor_phonenumber
					}
					, 
					{ // Value to change
						'$set' : { 'visitor_phonenumber' : '0111-111111111'//updatedocument.visitor_phonenumber
								   
						 } 
					}		   
				);
				return "update success";
			}
		}
		else // if user doesn't exists
		{
			return "invalid username";
		} 
	})
}
////////////////////////////////////////////////////////////////
	static async viewvisitor (user,visitor) {//view the visitor of the specified user
		return visitors.find(
			{'user_id' : user._id,
			'security_id':user.security_id,
			'visit_permission':'no access',
			'visitor_name':visitor.visitor_name,
			'visitor_phonenumber' : visitor.visitor_phonenumber,
			'number_of_visitors':visitor.number_of_visitors,
			'room_info': user.room_info,
			'arrival_time': user.arrival_time,
			'end_time': user.end_time
				//'user_id': visitor.user_id
			}
		).then(async user =>{
			return user;
		})
	}
	// // read : print user
	// static async view() {
	// 	return users.aggregate([{
	// 		$project:
	// 		{
	// 			'_id':0,
	// 			'username':1,
	// 			'phone':1
	// 		}
	// 	}]).toArray().then(async user =>{
	// 		return user;
	// 	})
	// }
	
}
module.exports = User; ///dksaldksl