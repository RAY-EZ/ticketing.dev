import express, { NextFunction, Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@d-ticket/common';

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
        validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        // const error = validationResult(req);

        // if (!error.isEmpty()) {
        //     return res.status(400).send(error.array());
        // }
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
        },
        process.env.JWT_KEY! 
        );

        req.session= {
          jwt: userJwt
        }
        console.log('A new User Created', user.id);
        res.status(201).send(user);
    })

export { router as signupRouter };