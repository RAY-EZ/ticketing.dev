import express from 'express';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError,currentUser } from '@d-ticket/common';
import { Request, Response, NextFunction } from 'express';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
// extrac check for jwt so throws error 401 instead of 404
app.use(currentUser);

app.use('/api/tickets',createTicketRouter);
app.use('/api/tickets',showTicketRouter);
app.use('/api/tickets',indexTicketRouter);
app.use('/api/tickets',updateTicketRouter);

app.all('*', async (req, res, next)=>{
  return next(new NotFoundError())
})

app.use(errorHandler);

export { app }