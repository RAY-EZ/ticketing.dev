
import request from 'supertest';
import { app } from '../../app';

it('fails when email supplied that doesn\'t exists', async ()=>{
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'asdfdf'
    })
    .expect(400)
})

it('fails when incorrect password is supplied', async ()=>{
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'asdfdf'
  })
  .expect(201)

  return request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'asdfdfsdf'
  })
  .expect(400)
})

it('sets the cookie after sign in', async ()=>{
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'asdfdf'
  })
  .expect(201)

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: 'asdfdf'
  })
  .expect(200)
  
  expect(response.get('Set-Cookie')).toBeDefined();
})