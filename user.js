//////////////////main function of user//////////////////////
let users, visitors;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
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

	// read : print user
	static async view() {
		return users.aggregate([{
			$project:
			{
				'_id':0,
				'username':1,
				'phone':1
			}
		}]).toArray().then(async user =>{
			return user;
		})
	}

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
			'username' : visitor.username,
			'phone' : visitor.phone,
			'role' : 'visitor',
			'user_id' : user._id
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
	static async deletevisitor(user,visitor) {	// Only delete when username and password are matched
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
}
module.exports = User;