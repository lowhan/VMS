
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
	const ali_user_sample = {		   				// ali user sample from db
		login_username : "Ali",
		login_password : "passwordfromali",
		user_name : "Abu",
		user_phonenumber : "012-3456789",
		security_id : "62ac2ed1bacb61b2121a2e3b"
	}
	const nobody_user_sample = {		   			// nobody user sample from db
		_id : "62ae7d37c2709b92aa1df80e",
		login_username : "nobody",
		login_password : "passwordfromnobody",
		user_name : "leo",
		user_phonenumber : "0175628915",
		security_id: "62adca86484ff13764fbb241"
	}

	// visitor
	const visitor_sample = {		   				// visitor sample 
		visitor_name : "visitortest1",
		visitor_phonenumber : "012-3456789",
		number_of_visitors : 5,
		room_info : "Blok C-057",
		arrival_time: "2021/06/13",
		end_time : "2021/06/20"
	}
	const update_visitor_sample = {		   			// visitor update sample
		visitor_name : "visitor1",
		visitor_phonenumber : "012-12345678",
		number_of_visitors : 5,
		room_info : "Blok A-120",
		arrival_time: "2021/01/20",
		end_time : "2021/02/20"
	}

	// facility 
	const nobody_facility_sample = {		   		// facility booking create sample for nobody that has only visitor 
		user_id : "62ae7d37c2709b92aa1df80e",
		visitor_id: "62ae813cc2709b92aa1df819",
		number_of_participants: 4,
		facility: "badminton_court"
	}
	
	const nobody_facility_update_sample = {		   	// facility update sample for nobody
		visitor_id: "62ae813cc2709b92aa1df819",
		number_of_participants: 2,
		facility: "swimming_pool"
	}

	// parking
	const nobody_parking_sample = {		   			// parking booking create sample for nobody that has only visitor
		user_id : "62ae7d37c2709b92aa1df80e",
		visitor_id: "62ae813cc2709b92aa1df819",
		carplate_number: "MES-1200",
		parking_lot: "B-10",
		arrival_time: "2022/05/21",
		end_time : "2022/05/30"
	}
	
	const nobody_parking_update_sample = {		   	// parking update sample for nobody
		visitor_id: "62ae813cc2709b92aa1df819",
		carplate_number: "PLC-1111",
		parking_lot: "F-23",
		arrival_time: "2022/05/11",
		end_time : "2022/05/30"
	}

	// variable for admin token
	let admin_token, user_token, user_sample_id;

	/////////////////////////////////////////////////////////////

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
	it('View Visitor - success', async () => {
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
	it('View Visitor - fail', async () => {
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

	// user - login
	it('User login',async() =>{				// for authorization
		const res = await request
			.post('/user/login')
			.send(ali_user_sample)			// req.body
		user_token = res.body.token;
	});

	it('User login',async() =>{				// sample with visitor
		const res = await request
			.post('/user/login')
			.send(nobody_user_sample)		// req.body
		nobody_user_token = res.body.token;
	});

	// user - create - visitor - authorise 
	it('Visitor Registration - success', async () => {
		return request
			.post('/user/visitor/create')
			.set('Authorization', `Bearer ${user_token}`)
			.send(visitor_sample) //req.body for register
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("visitor creation success");
		});
	});

	// user - create - visitor - authorise - duplicate
	it('Visitor Registration - fail', async () => {
		return request
			.post('/user/visitor/create')
			.set('Authorization', `Bearer ${user_token}`)
			.send(visitor_sample) //req.body for register
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("visitor creation fail");
		});
	});

	// user - create - visitor - unauthorise 
	it('Visitor Registration - fail', async () => {
		return request
			.post('/user/visitor/create')
			.send(visitor_sample) //req.body for register
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
		});
	});

	// user - view - visitor - authorise
	it('View Visitor - success', async () => {
		return request
			.get('/user/visitor/view')
			.set('Authorization', `Bearer ${user_token}`)
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				user_sample_id = res.body.user_id;			// get user_id from visitor that just created
				expect(res.body).toEqual(expect.any(Object));
		});
	});

	// admin > permission > visitor
	// admin - update - visitor - permission - unauthorise
	it('Visitor permission updation - fail', async () => {
		return request
			.patch('/admin/visitor/updatepermission/' + user_sample_id)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// admin - update - visitor - permission - authorise
	it('Visitor permission updation - success', async () => {
		return request
			.patch('/admin/visitor/updatepermission/' + user_sample_id) // user_sample_id = id of visitor that created by user
			.set('Authorization', `Bearer ${admin_token}`)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("visitor update permission success");
		});
	});	

	// user - view - visitor - unauthorise
	it('View Visitor - fail', async () => {
		return request
			.get('/user/visitor/view')
			.expect(401)
			.then(res => {
			 	expect(res.text).toBe("Unauthorized");
		});
	});

	// user - update - visitor - unauthorise
	it('User update visitor - fail', async () => {
		return request
			.patch('/user/visitor/update')
			.send(ali_user_sample,update_visitor_sample)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// user - update - visitor - authorise
	it('User update visitor - success', async () => {
		return request
			.patch('/user/visitor/update')
			.set('Authorization', `Bearer ${user_token}`)
			.send(ali_user_sample,update_visitor_sample) 
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("visitor update success");
		});
	});

	// user - delete - visitor - unauthorise
	it('Visitor Deletion - fail', async () => {
		return request
			.delete('/user/visitor/delete')
			.send(visitor_sample)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
		});
	});

	// user - delete - visitor - authorise
	it('Visitor Deletion - success', async () => {
		return request
			.delete('/user/visitor/delete')
			.set('Authorization', `Bearer ${user_token}`)
			.send({}) 
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("visitor deletion success");
			});
	});

	// user - delete - visitor - authorise - no visitor
	it('Visitor Deletion - fail', async () => {
		return request
			.delete('/user/visitor/delete')
			.set('Authorization', `Bearer ${user_token}`)
			.send({}) 											// after deletion from previous test		
			.expect(400)										// there is no visitor to update
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("visitor deletion fail");
			});
	});

	// admin - update - visitor - permission - authorise - no visitor found
	it('Visitor permission updation - fail', async () => {
		return request
			.patch('/admin/visitor/updatepermission/' + user_sample_id)
			.set('Authorization', `Bearer ${admin_token}`)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("visitor update permission fail");
		});
	});

	// user - update - visitor - authorise - no visitor found
	it('User update visitor - fail', async () => {
		return request
			.patch('/user/visitor/update')
			.set('Authorization', `Bearer ${user_token}`)
			.send(ali_user_sample,update_visitor_sample) 		// after deletion from previous test							
			.expect(400)										// there is no visitor to update
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("visitor update fail");
		});
	});

	// facility

	// user - create - facility - unauthorise
	it('User create facility - Fail', async () => {
		return request
			.post('/user/facility/create')
			.send(nobody_facility_sample,nobody_user_sample) 	
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// user - create - facility - authorise
	it('User create facility - success', async () => {
		return request
			.post('/user/facility/create')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_facility_sample,nobody_user_sample) 		//req.token = nobody_user_sample
			.expect(200)											//req.body for register
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("facility creation success");
		});
	});

	// user - create - facility - authorise - duplicate
	it('User create facility - fail', async () => {
		return request
			.post('/user/facility/create')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_facility_sample,nobody_user_sample) 	
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("facility creation fail");
		});
	});

	// user - update - facility - unauthorise
	it('User update facility - fail', async () => {
		return request
			.patch('/user/facility/update')
			.send(nobody_facility_update_sample,nobody_facility_sample) 
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// user - update - facility - authorise
	it('User update facility - success', async () => {
		return request
			.patch('/user/facility/update')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_facility_update_sample,nobody_facility_sample) 
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("facility update success");
		});
	});

	// facility - view
	it('View facility - success', async () => {
		return request
			.get('/facility/view/'+ nobody_user_sample._id)		// put an user_id that has facility
			.send({})
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Object));
		});
	});

	// admin - update - facility - permission - unauthorise 
	it('Facility Permission Updation - Fail', async () => {
		return request
			.patch('/admin/facility/updatefacilitypermission/'+ nobody_user_sample._id)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// admin - update - facility - permission - authorise 
	it('Facility Permission Updation - success', async () => {
		return request
			.patch('/admin/facility/updatefacilitypermission/'+ nobody_user_sample._id)
			.set('Authorization', `Bearer ${admin_token}`)
			.send(nobody_user_sample,admin_sample)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("facility permission update success");
		});
	});	

	// facility - delete - unauthorise
	it('Facility Deletion - fail', async () => {
		return request
			.delete('/facility/delete/' + nobody_user_sample._id)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
		});
	});

	// facility - delete - authorise
	it('Facility Deletion - success', async () => {
		return request
			.delete('/facility/delete/' + nobody_user_sample._id)	// an user_id that become has no facility
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("facility deletion success");
		});
	});

	// facility - delete - authorise - no facility
	it('Facility Deletion - fail', async () => {
		return request
			.delete('/facility/delete/'+ nobody_user_sample._id)
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("facility deletion fail");
		});
	});

	// facility - view - no facility
	it('View facility - fail', async () => {
		return request
			.get('/facility/view/'+ nobody_user_sample._id)		
			.send({})
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("no facility booking found");
		});
	});

	// user - update - facility - authorise - no facility
	it('User update facility - fail', async () => {
		return request
			.patch('/user/facility/update')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_facility_update_sample,nobody_facility_sample) 
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("facility update fail");
		});
	});

	// parking 

	// user - create - parking - unauthorise
	it('User create parking - Fail', async () => {
		return request
			.post('/user/parking/create')
			.send(nobody_parking_sample,nobody_user_sample) 	
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// user - create - parking - authorise
	it('User create parking - success', async () => {
		return request
			.post('/user/parking/create')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_parking_sample,nobody_user_sample) 		//req.token = nobody_user_sample
			.expect(200)											//req.body for register
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("parking creation success");
		});
	});

	// user - create - parking - authorise - duplicate
	it('User create parking - fail', async () => {
		return request
			.post('/user/parking/create')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_parking_sample,nobody_user_sample) 
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("parking creation fail");
		});
	});
	
	// user - update - parking - unauthorise
	it('User update parking - fail', async () => {
		return request
			.patch('/user/parking/update')
			.send(nobody_parking_update_sample,nobody_parking_sample) 
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// user - update - parking - authorise
	it('User update parking - success', async () => {
		return request
			.patch('/user/parking/update')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_parking_update_sample,nobody_parking_sample)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("parking update success");
		});
	});

	// parking - view
	it('View parking - success', async () => {
		return request
			.get('/parking/view/'+ nobody_user_sample._id)		// put an user_id that has parking booking
			.send({})
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Object));
		});
	});

	// admin - update - parking - permission - unauthorise 
	it('Parking Permission Updation - Fail', async () => {
		return request
			.patch('/admin/parking/updateparkingpermission/' + nobody_user_sample._id)
			.send(nobody_user_sample,admin_sample)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("Unauthorized");
		});
	});

	// admin - update - parking - permission - authorise 
	it('Parking Permission Updation - success', async () => {
		return request
			.patch('/admin/parking/updateparkingpermission/' + nobody_user_sample._id)
			.set('Authorization', `Bearer ${admin_token}`)
			.send(nobody_user_sample,admin_sample)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("parking permission update success");
		});
	});

	// parking - delete - unauthorise
	it('Parking Deletion - fail', async () => {
		return request
			.delete('/parking/delete/'+ nobody_user_sample._id)
			.expect(401)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("Unauthorized");
		});
	});

	// parking - delete - authorise
	it('Parking Deletion - success', async () => {
		return request
			.delete('/parking/delete/'+ nobody_user_sample._id)		// an user_id that become has no parking
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("parking deletion success");
		});
	});

	// parking - delete - authorise - no parking booking
	it('Parking Deletion - fail', async () => {
		return request
			.delete('/parking/delete/'+ nobody_user_sample._id)
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("parking deletion fail");
		});
	});

	// parking - view - no parking booking
	it('View parking - fail', async () => {
		return request
			.get('/parking/view/'+ nobody_user_sample._id)		
			.send({})
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("no parking booking found");
		});
	});

	// user - update - parking - authorise - no parking booking
	it('User update parking - fail', async () => {
		return request
			.patch('/user/parking/update')
			.set('Authorization', `Bearer ${nobody_user_token}`)
			.send(nobody_parking_update_sample,nobody_parking_sample) 
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
			expect(res.text).toBe("parking update fail");
		});
	});
});
