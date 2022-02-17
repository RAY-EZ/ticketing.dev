import { Ticket } from '../../models/ticket';

it('implements optimistic concurrency control', async ()=>{
  // creating Ticket
  const ticket = Ticket.build({
    title: 'one-piece',
    price: 5,
    userId: '123'
  })
  // saving it to database
  await ticket.save();

  // creating two reference to same ticket
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // saving first instance 
  firstInstance!.set({ price: 10});
  secondInstance!.set({ price : 15});

  // try{
  //   await firstInstance!.save();
    
  // } catch(err){
    
  // }
  await firstInstance!.save();
  await expect(async ()=>{
    return secondInstance!.save()
  }).rejects.toThrow();
  
})

it('update the version number on multiple saves', async ()=>{
  const ticket = Ticket.build({
    title: 'singeki no kyojin',
    price: 10,
    userId: '1234'
  });

  await ticket.save();

  for(let i =1; i <4; i++){

    ticket!.set({ price : 10 + i*5});
  
    await ticket.save();
  
    expect(ticket.version).toEqual(i)
  }

})