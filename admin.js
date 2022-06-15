//////////////////main function of admin//////////////////////
let admins, users, visitors;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt;
////////////////////////////////////////////////////////////

class Admin {
	static async injectDB(conn) {
		admins = await conn.db("VMS").collection("admin");
        users =  await conn.db("VMS").collection("users");
        visitors = await conn.db("VMS").collection("visitors");
	}
	////////////////////////////////////////////////////////////
	//CR = read and login for admin
    //CRUD = create, read,update and delete for user
    //RU = read and update for visitor
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

    //admin
	//create
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
	// }

	////////////////////////////////////////////////////////////
	// read 
	static async login(sample) { 											
		return admins.findOne({		//Check if username exists							
				'username': sample.username				
		}).then(async admin =>{
			if (admin) // Validate username
			{ 
				const PasswordValid = await bcrypt.compare(sample.password, admin.password)	// Validate password	 
				if (PasswordValid == false) 
				{
					return "invalid password";
				}
				else
				{
					return admin; // Return user object
				}
			}
			else // If admin doesn't exists
			{
				return "invalid username";
			}
		})
	}

	// read : print admin
	static async view() {
		return admins.aggregate([{
			$project:
			{
				'_id':0,
				'security_Name':1,
				'secuirty_PhoneNumber':1
			}
		}]).toArray().then(async admin =>{
			return admin;
		})
	}
    ////////////////////////////////////////////////////////////
    //create
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
	// 				return "user creation fail";
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
	// 			return "user creation success";
	// 		}
	// 	})	
	// }

	//user
	static async createuser(admin,user) {	
		return users.insertOne({	
			'username' : user.username,
			'phone' : user.phone,
			'role' : 'user',
			'user_id' : admin._id
		}).then(async res =>{
			if (res) 
			{ 	
				await users.updateOne(	
				{
					'username' : admin.username 
				}
				, 
				{ 
					'$set' : { 
						'user_id' : res.insertedId.toString()
					} 
				});		
				return "user creation success";
			}
			else 
			{
				return "user creation fail";
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
				console.log(user);
				//const PasswordValid = await bcrypt.compare(user.password,sample.password) // Validate password	
				if (sample.password != user.password) 
				{ 
					return "user deletion fail";
				}
				else
				{
					await users.deleteOne({'username': sample.username});
					return "user deletion success";
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
					return "user update fail";
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
					return "user update success";
				}
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}
    ////////////////////////////////////////////////////////////
	//visitor
    static async login(sample) { 											
		return visitors.find({		//Check if visitors exists							
				'username': sample.username				
		}).then(async user =>{
			if (visitors) // Validate username
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
}

module.exports = Admin;