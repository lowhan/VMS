
const supertest = require('supertest');
const request = supertest('http://localhost:3000'); //test on localhost with port 3000
jest.setTimeout(30000);

// variables to store tokens
describe('Express Route Test', function () {

	////////// Admin //////////
	
	// sample data 
	// admin
	const admin_sample = {		   					// exisiting admin sample
		_id: "62adca86484ff13764fbb241",
		login_username : "subadmin",			
		login_password : "passwordfromsubadmin"
	}
	const user_sample = {		   					// user sample
		login_username : "usertest1",
		login_password : "password1",
		user_name : "ali",
		user_phonenumber : "011-1234567"
	}
	const update_sample = {							// update sample
		login_username : "usertest1",	   			// update target
		user_name : 'alibaba',
		user_phonenumber : '011-98989898'
	}
	// user
	const ali_user_sample = {		   					// user sample
		login_username : "Ali",
		login_password : "passwordfromali",
		user_name : "Abu",
		user_phonenumber : "012-3456789"
	}

	// variable for admin token
	let admin_token, user_token;

	// admin - login
	it('Admin login',async() =>{			// for authorization
		const res = await request
			.post('/admin/login')
			.send(admin_sample)				//req.body
		admin_token = res.body.token;
	});

	// admin - view admin
	it('View Admin - success', async () => {
		return request
			.get('/admin/view')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Array));
		});
	});

	// admin - create - authorise
	it('User Registration - success', async () => {
		return request
			.post('/admin/user/create')
			.send(user_sample,admin_sample) 								//req.body for register
			.set('Authorization', `Bearer ${admin_token}`)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("user creation success");
			});
	});

	// admin - create - authorise - duplicate username
	it('User Registration - fail', async () => {
		return request
			.post('/admin/user/create')
			.send(user_sample,admin_sample) 								 //req.body for register
			.set('Authorization', `Bearer ${admin_token}`)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("user creation fail"); // duplicate
			});
	});

	// admin - create - unauthorise - duplicate username
	it('User Registration - fail', async () => {
		return request
			.post('/admin/user/create')
			.send(user_sample,admin_sample) 								//req.body for register
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized"); 		// authorized
			});
	});

	// admin - authorise - view user
	it('View User - success', async () => {
		return request
			.get('/admin/user/view')
			.set('Authorization', `Bearer ${admin_token}`)
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Array));
		});
	});

	// admin - unauthorise - view user
	it('View User - fail', async () => {
		return request
			.get('/admin/user/view')
			.expect(401)
			.then(res => {
			 	expect(res.text).toBe("Unauthorized");
		});
	});

	// admin - unauthorise - update user
	it('User updation - fail', async () => {
		return request
			.patch('/admin/user/update')
			.send(update_sample) 
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
		});
	});

	// admin - authorise - update user
	it('User updation - success', async () => {
		return request
			.patch('/admin/user/update')
			.set('Authorization', `Bearer ${admin_token}`)
			.send(update_sample) 
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("user update success");
		});
	});

	// admin - unauthorise - delete user
	it('User Deletion - fail', async () => {
		return request
			.delete('/admin/user/delete')
			.send(user_sample)						 // req.body for delete
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
			});
	});

	// admin - authorise - delete user
	it('User Deletion - success', async () => {
		return request
			.delete('/admin/user/delete')
			.set('Authorization', `Bearer ${admin_token}`)
			.send(user_sample)						 // req.body for delete
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("user deletion success");
			});
	});

	// admin - view - visitor - authorise
	it('View Vsitor - success', async () => {
		return request
			.get('/admin/visitor/view')
			.set('Authorization', `Bearer ${admin_token}`)
			.send({})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(res => {
			 	expect(res.body).toEqual(expect.any(Object));
		});
	});

	// admin - view - visitor - unauthorise
	it('View Vsitor - fail', async () => {
		return request
		.get('/admin/visitor/view')
			.expect(401)
			.then(res => {
			 	expect(res.text).toBe("Unauthorized");
			});
	});

// //import jwt_decode from "jwt-decode";
// const jwt_decode = require('jwt-decode');
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFjMmVkMWJhY2I2MWIyMTIxYTJlM2IiLCJsb2dpbl91c2VybmFtZSI6ImFkbWluIiwibG9naW5fcGFzc3dvcmQiOiIkMmEkMTAkYm41cnNjRTl1Vy9ST2pPbjhyYlE0T0g3NVlwRTh2bGNQd1lnZ1d0dDBubjl6bmZXSUJGcUciLCJzZWN1cml0eV9uYW1lIjoiSmFja3NvbiIsInNlY3VyaXR5X3Bob25lbnVtYmVyIjoiMDEyNDU2OTU2MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1NTQ4MzE1MywiZXhwIjoxNjU1NDg2NzUzfQ.XOk5IwQedLZQ68Mcg5Ydhh8gkcCsrYdFh5XGJ7dmxv4";
// var decoded = jwt_decode(token);
// console.log(decoded);
// const supertest = require('supertest');
// const request = supertest('http://localhost:3000'); //test on localhost with port 3000
// jest.setTimeout(30000);
 
// //sample data  
// const admin_sample = {	
// 	//_id: "62aafc8472263b2a3ed6e658",	   
//     login_username : "admin",				// make sure this data is not exist in your mongodb 
// 	login_password : "passwordfromadmin",
//     security_name: "Jackson",
// 	security_phonenumber : "0124569562",
// }

// const bad_admin_sample = {
// 	login_username : "admin2",				// make sure this data is not exist in your mongodb 
// 	login_password : "passwordfromadmin2",
//     security_name: "Jackson",
// 	security_phonenumber : "0124569562",
// }


// const user_sample = {						// new sample for register success, login success, delete success
//     _id : "62aafe1fb1082983abec82cd",
// 	security_id:"secure_1",
//     login_username : "usertest3",				// make sure this data is not exist in your mongodb 
// 	login_password : "password3",
//     user_name : "user_ali",
// 	user_phonenumber: "011-1234567",
//     role : "user",
// }

// const visitor_sample ={
	
// 		Visitor_Name:"Sherlock",
// 		Visitor_PhoneNumber:"011-222333444",
// 		Number_of_Visitors:"3",
// 		Room_info:"Blok A-223",
// 		Arrival_Time:"22/2/2022",
// 		End_Time:"31/2/2022"
	 
// }

// const facility_sample = {
//     'visitor_id' : "62ab3b290983751028fff1c6", 	// insert by user
//     'number_of_participants': 3,
//     'facility': "gym",
// }

// parking_sample = {
//    "visitor_id":"62ac3ea279e96d86c9d6c642",
//    "carplate_number":"MCB9758",
//    "parking_lot":"1",
//    "arrival_time":"22/2/2022",
//    "end_time":"3/4/2022" 

// }


// describe('Express Route Test', function () {

// 	//////////////////////////////////Admin/////////////////////////////////
// 	// // Admin-login///-150line
// 	////Expected to success////
// 	it('Admin login - success',async() =>{
// 		return request
// 			.post('/admin/login')
// 			.send(admin_sample)//req.body
// 			.expect(200).then(response =>{
// 				expect(response.body.status).toBe('admin login success')
// 			});
// 	});

// 	//Expected to fail////
// 	it ("Admin login - fail", async () => {
// 	return request
// 	.post('/admin/login')
// 			.send(bad_admin_sample)
// 			.expect(400)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe('admin login fail');
// 			});
// 	})

// 	////Admin - View//////
// 	it('View Admin - success', async () => {
// 		return request
// 		.get('/admin/view')
// 			.expect(200)
// 			.expect('Content-Type', /json/)
// 			.then(res => {
// 				expect(res.body).toEqual(expect.any(Array));
// 			});
// 	});

// 	//////// Admin - create user//////
// 	//Expected to fail
// 	it('User Registration - fail', async () => {
// 		return request
// 			.post('/admin/user/create')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});
// 	///////////Admin - view user//////////////
// 	///We cant get the token to authorize so we decided to use the 
// 	//the fail test to prove that our coding are able to run without
// 	//the token.  
// 	//Expected to fail
// 	it('View User - fail', async () => {
// 		return request
// 		.get('/admin/user/view')
// 			.expect(401)
// 			.then(res => {
// 			 	expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	//////// Admin - delete user//////
// 	//Expected to fail
// 	it('User Deletion - fail', async () => {
// 		return request
// 			.delete('/admin/user/delete')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	//////////////Admin- update user/////////////////
// 	//Expected to fail
// 	it('User updation - fail', async () => {
// 		return request
// 			.patch('/admin/user/update')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 		///////////Admin - view visitor//////////////
// 	///We cant get the token to authorize so we decided to use the 
// 	//the fail test to prove that our coding are able to run without
// 	//the token.  
// 	//Expected to fail
// 	it('View Vsitor - fail', async () => {
// 		return request
// 		.get('/admin/visitor/view')
// 			.expect(401)
// 			.then(res => {
// 			 	expect(res.text).toBe("Unauthorized");
// 			});
// 	});
// 	//////Admin udate visitor permission//////////////////////
// 	//Expected to fail
// 	it('Visitor permission updation - fail', async () => {
// 		return request
// 			.patch('/admin/visitor/updatepermission')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});
	
// 	////////////////////////Admin update facility permission///////////////
// 	//Expected to fail
// 	it('Facility Permission Updation - Fail', async () => {
// 		return request
// 			.patch('/admin/facility/updatefacilitypermission')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	///////////////////////////Admin update parking permission////////////////////
// 	//Expected to fail
// 	it('Parking Permission Updation - Fail', async () => {
// 		return request
// 			.patch('/admin/parking/updateparkingpermission')
// 			.send(user_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	/////////////////////////user///////////////////////////
// 	///////////////////// user - login //////////////////////
// 	it('User login - success',async() =>{
// 		return request
// 			.post('/user/login')
// 			.send(user_sample)//req.body
// 			.expect(200).then(response =>{
// 				expect(response.body.status).toBe('user login success')
// 			});
// 	});

// 	//////// User - create visitor//////
// 	//Expected to fail
// 	it('Visitor Registration - fail', async () => {
// 		return request
// 			.post('/user/visitor/create')
// 			.send(visitor_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	///////////////User - update visitor////////////////
// 	//Expected to fail
// 	it('User update visitor - fail', async () => {
// 		return request
// 			.patch('/user/visitor/update')
// 			.send(visitor_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	//////////////////////User - delete visitor///////////////////
// 	//Expected to fail
// 	it('Visitor Deletion - fail', async () => {
// 		return request
// 			.delete('/user/visitor/delete')
// 			.send(visitor_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 		///////////User- view visitor//////////////
// 	///We cant get the token to authorize so we decided to use the 
// 	//the fail test to prove that our coding are able to run without
// 	//the token.  
// 	//Expected to fail
// 	it('View Vsitor - fail', async () => {
// 		return request
// 		.get('/user/visitor/view')
// 			.expect(401)
// 			.then(res => {
// 			 	expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	///////////User - create facility//////////////////
// 	//Expected to fail
// 	it('User create facility - Fail', async () => {
// 		return request
// 			.post('/user/facility/create')
// 			.send(facility_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	///////////////////////User - update faciity/////////////////////
// 	//Expected to fail
// 	it('User update facility - fail', async () => {
// 		return request
// 			.patch('/user/facility/update')
// 			.send(facility_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 	});

// 	///////////User - create parking//////////////////
// 	//Expected to fail
// 	it('User create parking - Fail', async () => {
// 		return request
// 			.post('/user/parking/create')
// 			.send(parking_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 			expect(res.text).toBe("Unauthorized");
// 			});
// 		});
	
// 	///////////////User - update parking /////////////////
// 	//Expected to fail
// 		it('User update parking - fail', async () => {
// 			return request
// 				.patch('/user/parking/update')
// 				.send(parking_sample) //req.body for register
// 				.expect(401)
// 				.expect('Content-Type', /text/)
// 				.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 				});
// 		});
	
// 	////////////////////////Visitor - view/////////////////
// 	it('View Vsitor - success', async () => {//1318
// 		return request
// 		.get('/visitor/view')
// 		.send({})
// 			.expect(200)
// 			.then(res => {
// 			 	expect(res.text).toBe(expect.any(Array));
// 			});
// 	});	

// 	///////////////////////// Facility - view ///////////////


// 	/////////////////////////user and  admin - delete facility///////
// 	//Expected to fail
	
// 	it('Facility Deletion - fail', async () => {
// 		return request
// 			.delete('/facility/delete')
// 			.send(facility_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});


// 	/////////////////////parking/////////////////////////
// 	///////////////// Parking - view ///////////////////////



// 	////////////////user and admin -delete parking///////
// 	//Expected to fail

// 	it('Parking Deletion - fail', async () => {
// 		return request
// 			.delete('/parking/delete')
// 			.send(parking_sample) //req.body for register
// 			.expect(401)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe("Unauthorized");
// 			});
// 	});


	//////////////////////////////////////////////////////

	// // unfinished
	// // admin - update - visitor - permission - unauthorise
	// it('Visitor permission updation - fail', async () => {
	// 	return request
	// 		.patch('/admin/visitor/updatepermission')
	// 		.send(user_sample) 
	// 		.expect(401)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 		expect(res.text).toBe("Unauthorized");
	// 	});
	// });

	// // unfinished
	// // admin - update - facility - permission - unauthorise 
	// it('Facility Permission Updation - Fail', async () => {
	// 	return request
	// 		.patch('/admin/facility/updatefacilitypermission')
	// 		.send(user_sample) 
	// 		.expect(401)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 		expect(res.text).toBe("Unauthorized");
	// 	});
	// });

	// // unfinished
	// // admin - update - parking - permission - unauthorise 
	// it('Parking Permission Updation - Fail', async () => {
	// 	return request
	// 		.patch('/admin/parking/updateparkingpermission')
	// 		.send(user_sample)
	// 		.expect(401)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 		expect(res.text).toBe("Unauthorized");
	// 	});
	// });

	//////////////////////////////////////////////////////
	// user - login
	it('User login',async() =>{				// for authorization
		const res = await request
			.post('/user/login')
			.send(ali_user_sample)				//req.body
		user_token = res.body.token;
	});

});
