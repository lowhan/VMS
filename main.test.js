//import jwt_decode from "jwt-decode";
const jwt_decode = require('jwt-decode');
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmFjMmVkMWJhY2I2MWIyMTIxYTJlM2IiLCJsb2dpbl91c2VybmFtZSI6ImFkbWluIiwibG9naW5fcGFzc3dvcmQiOiIkMmEkMTAkYm41cnNjRTl1Vy9ST2pPbjhyYlE0T0g3NVlwRTh2bGNQd1lnZ1d0dDBubjl6bmZXSUJGcUciLCJzZWN1cml0eV9uYW1lIjoiSmFja3NvbiIsInNlY3VyaXR5X3Bob25lbnVtYmVyIjoiMDEyNDU2OTU2MiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1NTQ4MzE1MywiZXhwIjoxNjU1NDg2NzUzfQ.XOk5IwQedLZQ68Mcg5Ydhh8gkcCsrYdFh5XGJ7dmxv4";
var decoded = jwt_decode(token);
console.log(decoded);
const supertest = require('supertest');
const request = supertest('http://localhost:3000'); //test on localhost with port 3000
jest.setTimeout(30000);
 
//sample data  
const admin_sample = {	
	//_id: "62aafc8472263b2a3ed6e658",	   
    login_username : "admin",				// make sure this data is not exist in your mongodb 
	login_password : "passwordfromadmin",
    security_name: "Jackson",
	security_phonenumber : "0124569562",
}


const user_sample = {						// new sample for register success, login success, delete success
    _id : "62aafe1fb1082983abec82cd",
	security_id:"secure_1",
    login_username : "usertest3",				// make sure this data is not exist in your mongodb 
	login_password : "password3",
    user_name : "user_ali",
	user_phonenumber: "011-1234567",
    role : "user",
}
const newsample = {						// new sample for register success, login success, delete success
	username : "usertest1",				// make sure this data is not exist in your mongodb 
	password : "passwordfromusertest1",
	phone : "011-1111111",
	role : "user",
}

const updatesample = {					// update sample for update success
	username : "usertest1",					
	password : "passwordfromusertest1",
	phone : "999",
	role : "admin",
}

const badusersample = {					// badusersample for login fail (invalid username)
	username : "baduser",					
	password : "passwordfromusertest1",
	phone : "011-1111111",
	role : "user",
}

const badpasswordsample = {				// badpsample for register fail, login fail (invalid password),  
	username : "usertest1",				// update fail, delete fail
	password : "badpassword",
	phone : "011-1111111",
	role : "user",
}

describe('Express Route Test', function () {
	////////////////////////////////////////////////////////////////////////
	// get 

	// testing
	// it('should return Welcome to OUR page !', async () => {		
	// 	return request.get('/test')
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('testing... you are good for now');
	// 		});
	// });

	// it('View User - success', async () => {
	// 	return request.get('/user')
	// 		.expect(200)
	// 		.expect('Content-Type', /json/)
	// 		.then(res => {
	// 				expect(res.body).toEqual(expect.any(Array));
	// 		});
	// });

	///////////////////////////////////////////////////////////////////////
	// post - create

	// Expected to success
	// it('User Registration - success', async () => {
	// 	return request
	// 		.post('/user/register')
	// 		.send(newsample) //req.body for register
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe("creation success");
	// 		});
	// });

	// // Expected to fail
	// it('User Registration - fail', async () => {
	// 	return request
	// 		.post('/user/register')
	// 		.send(badpasswordsample) //req.body for register
	// 		.expect(400)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe("creation fail");
	// 		});
	// });

	///////////////////////////////////////////////////////////////////////
	// post - read 
 
	// Expected to success
	// it('User login - success', async () => {
	// 	return request
	// 		.post('/user/login')
	// 		.send(newsample) //req.body
	// 		.expect('Content-Type', /json/)
	// 		.expect(200).then(response => {
	// 			expect(response.body).toEqual(
	// 				expect.objectContaining({ // Detail can be retrieved
	// 					_id : expect.any(String),
	// 					username: expect.any(String),
	// 					phone: expect.any(String),
	// 					role: expect.any(String),
	// 				})
	// 			)
	// 		});
	// });
	//////////////////////////////////Admin/////////////////////////////////
	// // Admin-login///-150line
	////Expected; to login////
	it('Admin login - success',async() =>{
		return request
			.post('/admin/login')
			.send(admin_sample)//req.body
			.expect(200).then(response =>{
				expect(response.body.status).toBe('admin login success')
			});
	});
	//Expected to fail////
	it ("Admin login - fail", async () => {
	return request
	.post('/admin/login')
			.send(badusersample)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('admin login fail');
			});
	})

	////Admin - View//////
	it('View Admin - success', async () => {
		return request
		.get('/admin/view')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Array));
			});
	});

	//////// Admin - create user//////
	//Expected to success
	it('User Registration - success', async () => {
		return request
			.post('admin/user/create')
			.send(user_sample) //req.body for register
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("user creation success");
			});
	});
	///////////Admin - view user//////////////
	it('View User - success', async () => {
		return request
		.get('/admin/user/view')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).toEqual(expect.any(Array));
			});
	});

	// // Expected to fail
	// it('User login - fail', async () => {
	// 	return request
	// 		.post('/user/login')
	// 		.send(badusersample)
	// 		.expect(400)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('login fail');
	// 		});
	// })

	// ///////////////////////////////////////////////////////////////////////
	// // patch - update

	// // Expected to success
	// it('Update info - success', async () => {
	// 	return request
	// 		.patch('/user/update')
	// 		.send(updatesample) //req.body for register
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('update success');
	// 		});
	// });

	// // Expected to fail
	// it('Update info - fail', async () => {
	// 	return request
	// 		.patch('/user/update')
	// 		.send(badpasswordsample) //req.body for register
	// 		.expect(400)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('update fail');
	// 		});
	// });

	// ///////////////////////////////////////////////////////////////////////
	// // delete

	// // Expected to fail
	// it('Delete username - fail', async () => {
	// 	return request
	// 		.delete('/user/delete')
	// 		.send(badpasswordsample) //req.body for register
	// 		.expect(400)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('deletion fail');
	// 		});
	// });

	// // Expected to success
	// it('Delete username - success', async () => {
	// 	return request
	// 		.delete('/user/delete')
	// 		.send(newsample) //req.body for register
	// 		.expect(200)
	// 		.expect('Content-Type', /text/)
	// 		.then(res => {
	// 			expect(res.text).toBe('deletion success');
	// 		});
	// });

	///////////////////////////////////////////////////////////////////////
});
