// Jest mock import/ redirecting import-- file name is exactly same as the nats-wrapper in up one 
/// directory
export const natsWrapper = {
  // Jest Mock function
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: ()=> void)=>{
          callback();
        }
      )
  }
}