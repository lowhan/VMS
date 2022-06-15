//////////////////main function of admin//////////////////////
let admins;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt;
////////////////////////////////////////////////////////////

class Admin {
	static async injectDB(conn) {
		admins = await conn.db("VMS").collection("admin")
	}
	////////////////////////////////////////////////////////////
	//CR= create, read
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
		return admins.findOne({		//Check if username exists						 
				'username': sample.username			
		}).then(async admin =>{
			if (admin) 
			{
				if (admin.username == sample.username)
				{
					return "creation fail";
				}
			}
			else
			{
				await admins.insertOne({	 //Save admin to database				
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
			else // If user doesn't exists
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
				'username':1,
				'phone':1
			}
		}]).toArray().then(async admin =>{
			return admin;
		})
	}
}

module.exports = Admin;