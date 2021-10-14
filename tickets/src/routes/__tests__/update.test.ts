import request  from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if the ticket with id doesn\'t exists', async()=>{
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'one-piece',
      price: 20
    })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async()=>{
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'one-piece',
      price: 40
    })
    .expect(401)
})

it('return a 401 if the user does not own ticket', async()=>{
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'one-piece',
      price: 20
    })
    .expect(201)
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'one-piece',
      price: 40
    })
    .expect(401)
})

it('return 400 if user provides invalid title or price', async()=>{
  const cookie = global.signin()
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'one-piece',
    price: 20
  })
  .expect(201)

  //invalid Title
  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 20
  })
  .expect(400)

  //invalid Price
  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'one-piece',
    price: -20
  })
  .expect(400)

})

it('updates the ticket provided valid inputs', async()=>{
  const cookie = global.signin()
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'one-piece',
    price: 20
  })
  .expect(201)

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'one-piece-wano-kuni',
    price: 40
  })
  .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('one-piece-wano-kuni')
  expect(ticketResponse.body.price).toEqual(40)
  })

