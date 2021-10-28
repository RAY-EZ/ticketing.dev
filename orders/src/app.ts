import express from 'express';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError,currentUser } from '@d-ticket/common';
import { Request, Response, NextFunction } from 'express';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
// extrac check for jwt so throws error 401 instead of 404
app.use(currentUser);

app.use('/api/orders',newOrderRouter);
app.use('/api/orders',showOrderRouter);
app.use('/api/orders',indexOrderRouter);
app.use('/api/orders',deleteOrderRouter);

app.all('*', async (req, res, next)=>{
  return next(new NotFoundError())
})

app.use(errorHandler);

export { app }