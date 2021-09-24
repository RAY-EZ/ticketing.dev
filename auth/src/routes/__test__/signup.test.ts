import request from 'supertest';
import { app }  from '../../app';

it('return 201 on successfull signup', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      'email': 'test@test.com',
      'password': 'asdfsdf'
    })
    .expect(201);
})

it('returns 400 on signing up with same email', async ()=>{
  await request(app)
    .post('/api/users/signup')
    .send({
      'email': 'test@test.com',
      'password': 'asdfsdf'
    })
    .expect(201);
  
    return request(app)
    .post('/api/users/signup')
    .send({
      'email': 'test@test.com',
      'password': 'asdfsdf'
    })
    .expect(400);
})

it('returns 400 on empty email or password', async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
      'email': 'test@test.com',
    })
    .expect(400);

    return request(app)
    .post('/api/users/signup')
    .send({
      'password': 'asdfsdf'
    })
    .expect(400);
})

it('set cookie after successful signup', async ()=>{
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      'email': 'test@test.com',
      'password': 'asdfdf'
    })
    .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined();
    return;
})