const supertest = require('supertest');
const request = supertest('http://localhost:3000'); //test on localhost with port 3000
jest.setTimeout(30000);
 
//sample data  
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Flow of the test :  																				//						   
// Start > Register success (newsample) > Register fail (badpsample) > Login success (newsample) >  //
// Login fail (badusersample) > update success (updatesample) > update fail (badpsample) >          //	
// delete fail (badpsample) > delete success (newsample) > End           							//
//////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Express Route Test', function () {
	////////////////////////////////////////////////////////////////////////
	// get 

	// testing
	it('should return Welcome to OUR page !', async () => {		
		return request.get('/test')
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('testing... you are good for now');
			});
	});

	it('View User - success', async () => {
		return request.get('/user')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
					expect(res.body).toEqual(expect.any(Array));
			});
	});

	///////////////////////////////////////////////////////////////////////
	// post - create

	// Expected to success
	it('User Registration - success', async () => {
		return request
			.post('/user/register')
			.send(newsample) //req.body for register
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("creation success");
			});
	});

	// Expected to fail
	it('User Registration - fail', async () => {
		return request
			.post('/user/register')
			.send(badpasswordsample) //req.body for register
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe("creation fail");
			});
	});

	///////////////////////////////////////////////////////////////////////
	// post - read 
 
	// Expected to success
	it('User login - success', async () => {
		return request
			.post('/user/login')
			.send(newsample) //req.body
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({ // Detail can be retrieved
						_id : expect.any(String),
						username: expect.any(String),
						phone: expect.any(String),
						role: expect.any(String),
					})
				)
			});
	});

	// Expected to fail
	it('User login - fail', async () => {
		return request
			.post('/user/login')
			.send(badusersample)
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('login fail');
			});
	})

	///////////////////////////////////////////////////////////////////////
	// patch - update

	// Expected to success
	it('Update info - success', async () => {
		return request
			.patch('/user/update')
			.send(updatesample) //req.body for register
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('update success');
			});
	});

	// Expected to fail
	it('Update info - fail', async () => {
		return request
			.patch('/user/update')
			.send(badpasswordsample) //req.body for register
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('update fail');
			});
	});

	///////////////////////////////////////////////////////////////////////
	// delete

	// Expected to fail
	it('Delete username - fail', async () => {
		return request
			.delete('/user/delete')
			.send(badpasswordsample) //req.body for register
			.expect(400)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('deletion fail');
			});
	});

	// Expected to success
	it('Delete username - success', async () => {
		return request
			.delete('/user/delete')
			.send(newsample) //req.body for register
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('deletion success');
			});
	});

	///////////////////////////////////////////////////////////////////////
});
