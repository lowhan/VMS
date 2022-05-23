let users;

const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
var encrypt;

class User {
	static async injectDB(conn) {
		users = await conn.db("TDDweek7").collection("users")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {String} username 
	 * @param {String} password  
	 */

	static async register(username, password) {
		// TODO: Hash password
		bcrypt.genSalt(saltRounds, function (saltError, salt) { 
			if (saltError) {
			  throw saltError
			} else {
			  	bcrypt.hash(password, salt, function(hashError, hash) {  
					if (hashError) {
				  		throw hashError
					} else {
						encrypt = hash;
					}
			  	})
			}
		});
		// TODO: Check if username exists
		return users.findOne({								 
				'username': username			
		}).then(async user =>{
			if (user) {
				if ( user.username == username )
				{
					return "user exist";
				}
			}
			else
			{
				// TODO: Save user to database
				await users.insertOne({						
					'username' : username,
					'password' : encrypt
				})
				return "new user created";
			}
		})	
	}

	static async login(username, password) {
		// TODO: Check if username exists
		return users.findOne({								
				'username': username				
		}).then(async user =>{
			if (user) { // Validate username
				
				const PasswordValid = await bcrypt.compare(password, user.password)
				// TODO: Validate password 
				if ( PasswordValid == false) {
					return "invalid password";
				}
				else
				{
					// TODO: Return user object
					return user;
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