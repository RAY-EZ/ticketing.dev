import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
  ],
  validateRequest
  ,async (req:Request, res: Response, next: NextFunction)=>{

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    const passwordMatch = await Password.compare(
      existingUser?.password!,
      password
    );

    if(!passwordMatch){
      return next(new BadRequestError('wrong email or password'));
    }

    const userJwt = jwt.sign(
      {
        id: existingUser?.id,
        email: existingUser?.email
      },
      process.env.JWT_KEY!
    );
    
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
})

export { router as signinRouter };