const request = require('supertest');
const app = require('../server'); 



const loginAndGetToken = async () => {
    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: 'admin7@gmail.com',
            password: 'passwordd'
        });
    const token = loginResponse.body.token;
    
    return token;
};
const loginAndGetTokenUser = async () => {
    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: 'policyHolderTest@gmail.com',
            password: 'password'
        });
    const token = loginResponse.body.token;

    return token;
};


describe('Protected Routes', () => {
    let token;

    beforeEach(async () => {
        token = await loginAndGetToken();
    });

    it('should access the protected user route', async () => {
        const response = await request(app)
            .get('/user')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should access the protected all users route', async () => {
        const response = await request(app)
            .get('/all-users')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });
    it('should update claim status to "Reimbursed"', async () => {
        const response = await request(app)
            .put(`/TPA/claims/${"65e976f52818a3ef3abb6b37"}`)
            .set('Cookie', [`token=${token}`])
            .send({ status: 'Reimbursed' });
        expect(response.status).toBe(200);
        expect(response.body.claim.status).toBe('Reimbursed');
    });
    it('should not access the profile of a user', async () => {
        const response = await request(app)
            .get('/user')

        expect(response.status).toBe(401);
    });





});


describe('once again a protected route', () => {
    let token;

    beforeEach(async () => {
        token = await loginAndGetTokenUser();
    });
    it('should not access the admin route of all claims', async () => {
        const response = await request(app)
            .get('/TPA/claims')
            .set('Cookie', [`token=${token}`]);
        expect(response.status).toBe(403);
    });





})

it('should register a new user', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({
            name: 'testaadmin',
            email: 'testaddddmin@example.com',
            password: 'password'
        });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
}, 50000);
