import { MongoMemoryServer } from 'mongodb-memory-server';
import  mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// declare var global
declare global{
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

let mongo: any;

jest.mock('../nats-wrapper')

beforeAll(async ()=>{
  process.env.JWT_KEY = 'fuckyou';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
// Passing Callback to connect results into error 
  await mongoose.connect(mongoUri)
});

beforeEach(async ()=>{
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections ){
    await collection.deleteMany({});
  }
})

afterAll( async ()=>{
  await mongo.stop();
  await mongoose.connection.close();
})

global.signin= ()=>{
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token};

  const sessionJSON = JSON.stringify(session);
  
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`]

};


