import express, { NextFunction, Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup',
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password length must be between 4 and 20 characters'),
    async (req: Request, res: Response, next: NextFunction) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).send(error.array());
        }

        const {email, password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
          return next(new BadRequestError('Email in use'));
        }

        const user = User.build({email, password});
        await user.save();
        const userJwt = jwt.sign({
          id:user.id,
          email: user.email
        }, 'fuckyou');

        req.session= {
          jwt: userJwt
        }

        res.status(201).send(user);
    })

export { router as signupRouter };