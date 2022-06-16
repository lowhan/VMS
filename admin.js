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

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// for admin only, login 
	static async loginadmin(sample) { 											
		return admins.findOne({		//Check if username exists							
				'login_username': sample.login_username				
		}).then(async admin =>{
			if (admin) // Validate username
			{ 
				const PasswordValid = await bcrypt.compare(sample.login_password, admin.login_password)	// Validate password	 
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
				'security_name':1,
				'security_phonenumber':1
			}
		}]).toArray().then(async admin =>{
			return admin;
		})
	}
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// manage user
	// create user - C
	static async createuser(admin,user) {
		//Hash password	
		bcrypt.genSalt(saltRounds, function (saltError, salt) {  
			if (saltError) 
			{
				throw saltError
			} 
			else 
			{
				bcrypt.hash(user.login_password, salt, function(hashError, hash) 
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
		return users.insertOne({	
			'login_username' : user.username,
			'login_password' : encrypt,       // from user.username
			'user_name' : user.user_name,
			'user_phonenumber' : user.user_phonenumber,	
			'security_id' : admin._id,
			'role' : 'user',
		}).then(async res =>{
			if (res) 
			{ 			
				return "user creation success";
			}
			else 
			{
				return "user creation fail";
			} 
		})
	}

	// read user - R
	static async viewuser() {
		return users.aggregate([{
			$project:
			{
				'login_password':0,
			}
		}]).toArray().then(async user =>{
			return user;
		})
	}

	// delete user - D
	static async deleteuser(sample) {	// Only delete when username and password are matched
		return users.findOne({								
			'login_username': sample.login_username				
		}).then(async user =>{
			if (user) // Validate username
			{ 			
				await users.deleteOne({'login_username': user.username}); // no need compare password, admin is the top admin
				return "user deletion success";
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}

	// update user - U
	static async updateuser(sample, updatedoc) {	// Only update when username and password are matched
		return users.findOne({								
			'login_username': sample.login_username				
		}).then(async user =>{
			if (user) // Validate username
			{ 			
				await users.updateOne(	
					{ // Target to change
						'login_username' : user.login_username
					}
					, 
					{ // Value to change
						'$set' : 
						{ 
							'user_name' : updatedoc.user_name,
							'user_phonenumber' : updatedoc.user_phonenumber 
						} 
					}		   
				);
				return "user update success";
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}
	
    //////////////////////////////////////////////////////////////////////////////////////////
	// view all visitors - R
	
    static async viewusevisitor() {
		return visitors.find({}).toArray().then(async visitor =>{ 
			if (visitor)
			{
				return visitor;
			}
			else
			{
				return "visitor view fail";
			}
		})
	}
}

module.exports = Admin;