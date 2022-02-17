import request from "supertest";
import { app } from '../../app';

const createTicket = ()=>{
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'one-piece',
      price: 20
    })
}

it('fetches all the tickets', async ()=>{
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .expect(200);

    expect(response.body.length).toEqual(3);
})