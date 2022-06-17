//////////////////main function of admin//////////////////////
let admins, users, visitors;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt, encryptadmin;
////////////////////////////////////////////////////////////

class Admin {
	static async injectDB(conn) {
		admins = await conn.db("VMS").collection("admins");
        users =  await conn.db("VMS").collection("users");
        visitors = await conn.db("VMS").collection("visitors");
	}

    //admin
	//create
	static async createadmin(admin) {		
		//Hash password	
		bcrypt.genSalt(saltRounds, function (saltError, salt) {  
			if (saltError) 
			{
				throw saltError
			} 
			else 
			{
				bcrypt.hash(admin.login_password, salt, function(hashError, hash) 
				{  
					if (hashError) 
					{
				  		throw hashError
					} 
					else 
					{
						encryptadmin = hash;
					}
				})
			}
		});	
		return admins.findOne({								
			'login_username': admin.login_username				
		}).then(async res =>{
			if (res) // duplicate
			{ 			
				return "admin creation fail";
			}
			else 
			{
				await admins.insertOne({	
					'login_username' : admin.login_username,
					'login_password' : encryptadmin,       // from user.username
					'security_name' : admin.security_name,
					'security_phonenumber' : admin.security_phonenumber,	
					'role' : 'admin'
				})
				return "admin creation success";
			} 
		})
	}

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
	static async viewadmin() {
		return admins.aggregate([{
			$project:
			{
				'security_name':1,
				'security_phonenumber':1,
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
		// search for duplicate
		//console.log(user.login_username)
		return users.findOne({								
			'login_username': user.login_username				
		}).then(async res =>{
			if (res) // duplicate
			{ 			
				return "user creation fail";
			}
			else 
			{
				await users.insertOne({	
					'login_username' : user.login_username,
					'login_password' : encrypt,       // from user.username
					'user_name' : user.user_name,
					'user_phonenumber' : user.user_phonenumber,	
					'security_id' : admin._id,
					'role' : 'user'
				})
				return "user creation success";
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
				await users.deleteOne({'login_username': user.login_username}); // no need compare password, admin is the top admin
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
	
    static async viewuservisitor() {
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

	// update visitor permission - U
	static async updateuservisitor(sample) {	// Only update when username and password are matched
		return visitors.findOne({								
			'user_id': sample.user_id				
		}).then(async visitor =>{
			if (visitor) // Validate username
			{ 			
				await visitors.updateOne(	
					{ // Target to change
						'user_id' : visitor.user_id
					}
					, 
					{ // Value to change
						'$set' : 
						{ 
							'visit_permission' : 'yes_access',
						} 
					}		   
				);
				return "user update permission success";
			}
			else // if user doesn't exists
			{
				return "invalid username";
			} 
		})
	}
}

module.exports = Admin;