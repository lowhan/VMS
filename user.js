//////////////////main function of user//////////////////////
let users;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt;
////////////////////////////////////////////////////////////

class User {
	static async injectDB(conn) {
		users = await conn.db("Lab3").collection("users")
	}
	////////////////////////////////////////////////////////////
	//CRUD = create, read, update, delete
	////////////////////////////////////////////////////////////

	//create
	static async register(sample) {		
		//Hash password	
		bcrypt.genSalt(saltRounds, function (saltError, salt) {  
			if (saltError) 
			{
				throw saltError
			} 
			else 
			{
				bcrypt.hash(sample.password, salt, function(hashError, hash) 
				{  
					if (hashError) 
					{
				  		throw hashError
					} 
					else 
					{
						encrypt = hash;
					}
				})
			}
		});
		//registration
		return users.findOne({		//Check if username exists						 
				'username': sample.username			
		}).then(async user =>{
			if (user) 
			{
				if (user.username == sample.username)
				{
					return "creation fail";
				}
			}
			else
			{
				await users.insertOne({	 //Save user to database				
					'username' : sample.username,
					'password' : encrypt,
					'phone' : sample.phone,
					'role' : sample.role
				})
				return "creation success";
			}
		})	
	}

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
				const PasswordValid = await bcrypt.compare(sample.password, user.password) // Validate password		 
				if (PasswordValid == false) 
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
	static async update(sample) {	// Only update when username and password are matched
		return users.findOne({								
			'username': sample.username				
		}).then(async user =>{
			if (user) // Validate username
			{ 			
				const PasswordValid = await bcrypt.compare(sample.password, user.password) // Validate password		 
				if (PasswordValid == false) 
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
							'$set' : { 'phone' : sample.phone,
									   'role'  : sample.role
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
}

module.exports = User;