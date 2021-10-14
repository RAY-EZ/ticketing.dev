import  mongoose  from 'mongoose';
import { app } from './app';


const start = async ()=> {
  if(!process.env.JWT_KEY){
    throw new Error('JWT key must be defined as environment variable');
  }
  if(!process.env.MONGO_URI){
    throw new Error('Database connection string must be provided')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err){
    console.log(err)
  }
  app.listen(3000, () => {
      console.log('Listening on Port 3000!!')
  });
}

start();

// How Jonas Implmented Error Handling vs Stephen Grider 
// Making Diagram flow of how error Handling Works
// Catching Async Error in general -- Javascript.info