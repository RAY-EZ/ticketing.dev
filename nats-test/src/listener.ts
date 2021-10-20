import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';



const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect',()=>{
  console.log('Listener connected to NATS');
  stan.on('close', ()=>{
    console.log('Nats connection Closed!');
    process.exit();
  })
  const options = stan.subscriptionOptions().setManualAckMode(true);
  
  const subscription = stan.subscribe('ticket:created','orders-service-queue-group',options);

  subscription.on('message', (msg: Message)=>{
    const data = msg.getData();
    
    if(typeof data === 'string'){
      console.log(`Event no(#${msg.getSequence()}) --- Data (${data})`)
    }
    msg.ack()
    console.log('Message recieved');
  })
})

process.on('SIGINT', ()=>stan.close())
process.on('SIGTERM', ()=>stan.close())
