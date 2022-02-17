import request from "supertest";
import { app } from '../../app';

it('returns 404 if the ticket not found', async ()=>{
  await request(app)
    .get('/api/tickets/asdfasf')
    .set('Cookie', global.signin())
    .expect(404)
})

it('returns the ticket if the ticket is found', async ()=>{
  const title = 'one-piece'
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201)
  
  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .expect(200)
  expect(ticket.body.title).toEqual(title);
})