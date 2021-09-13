import express from 'express';
import  mongoose  from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: true
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

const catchAsync = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
}
// app.get('*', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     throw new NotFoundError();
// }))

app.get('/api/users/', (req, res) => {
    res.send('I love Coding ❤️ 😁');
});

app.use(errorHandler);

const start = async ()=> {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
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