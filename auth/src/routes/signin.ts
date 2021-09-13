import express, { Router } from 'express';

const router = express.Router();

router.post('/api/users/signin',(req,res,next)=>{
    res.send('Hi from api/users/signin');
})

export { router as signinRouter };