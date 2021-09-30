import express from 'express';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@d-ticket/common';

import { Request, Response, NextFunction } from 'express';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
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

export { app }