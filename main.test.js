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
