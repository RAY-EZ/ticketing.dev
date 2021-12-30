import { natsWrapper } from './nats-wrapper';

const start = async ()=> {
  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID must be defined as environment variable');
  }
  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID must be defined as environment variable');
  }
  if(!process.env.NATS_URL){
    throw new Error('NATS_URL must be defined as environment variable');
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', ()=>{
      console.log('Nats connection Closed!');
      process.exit();
    })
    process.on('SIGINT',()=> natsWrapper.client.close())  
    process.on('SIGTERM',()=> natsWrapper.client.close())  
    
  } catch (err){
    console.log(err)
  }
}

start();

// How Jonas Implmented Error Handling vs Stephen Grider 
// Making Diagram flow of how error Handling Works
// Catching Async Error in general -- Javascript.info