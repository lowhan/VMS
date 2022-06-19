//////////////////main function of user//////////////////////
let users, visitors;
const { hash } = require("bcrypt");
const bcrypt = require("bcryptjs")
const saltRounds = 10;
////////////////////////////////////////////////////////////

class User {
	static async injectDB(conn) {
		users = await conn.db("VMS").collection("users");
		visitors = await conn.db("VMS").collection("visitors");
	}

	// user - login
	static async loginuser(sample) { 											
		return users.findOne({		//Check if username exists							
			'login_username': sample.login_username				
		}).then(async user =>{
			if (user) // Validate username
			{ 
				const PasswordValid = await bcrypt.compare(sample.login_password, user.login_password)	// Validate password	 
				if (PasswordValid == false) 
				{
					return "invalid password";
				}
				else
				{
					return user; // Return user object
				}
			}
			else
			{
				return "invalid username"; // If user doesn't exists
			}
		})
	}

	// view user info - R
	static async viewuser (user) { //view the visitor of the specified user
		return users.findOne(
			{
				'login_username' : user.login_username
			}
		).then(async user =>{
			if(user)
			{
				return user;
			}
			else
			{
				return "no user found"
			}		
		})
	}

	////////////////////////////////////////////////////////////

	// create visitor - C
	static async createvisitor(user,visitor) {
		return visitors.findOne({
			'user_id' : user._id
		}).then(async res =>{
			if (res) 
			{ 	
				return "visitor creation fail";
			}
			else 
			{
				await visitors.insertOne( // Insert visitor
				{	
					'user_id' : user._id,
					'security_id' : user.security_id,
					'visit_permission' : 'no access',
					'visitor_name' : visitor.visitor_name,
					'visitor_phonenumber' : visitor.visitor_phonenumber,
					'number_of_visitors' : visitor.number_of_visitors,
					'room_info' : visitor.room_info,
					'arrival_time' : visitor.arrival_time,
					'end_time' : visitor.end_time
				})
				return "visitor creation success";
			} 
		})
	}

	//Update Visitor - U
	static async updatevisitor(token,target) {	// target = detail of visitors
		return visitors.findOne({			
			'user_id': token._id 						
	}).then(async visitor =>{
		if (visitor) 
		{ 			 
			await visitors.updateOne(	
			{ // Target to change
				'_id' : visitor._id
			}
			, 
			{ // Value to change
				'$set' : 
				{ 
					'visitor_name' : target.visitor_name,
					'visitor_phonenumber' : target.visitor_phonenumber,
					'number_of_visitors' : target.number_of_visitors,
					'room_info' : target.room_info,
					'arrival_time' : target.arrival_time,
					'end_time' : target.end_time	   
				 } 
			});
			return "visitor update success";
		}
		else // if user has no visitor
		{
			return "visitor update fail";
		} 
	})
	}
	
	// delete visitor - D
	static async deletevisitor(token) {	// delete the visitor of the specified user
		return visitors.findOne({								
			'user_id': token._id		
		}).then(async visitor =>{
			if (visitor) 
			{ 			
				await visitors.deleteOne({'_id':visitor._id});
				return "visitor deletion success";
			}
			else // if visitor doesn't exists
			{
				return "visitor deletion fail";
			} 
		})
	}

	// view visitor - R
	static async viewvisitor (user) { //view the visitor of the specified user
		return visitors.findOne(
			{
				'user_id' : user._id
			}
		).then(async visitor =>{
			if(visitor)
			{
				return visitor;
			}
			else
			{
				return "no visitor found"
			}		
		})
	}
}
module.exports = User; 