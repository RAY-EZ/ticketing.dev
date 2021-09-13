import express, { Router } from 'express';

const router = express.Router();

router.post('/api/users/signout',(req,res,next)=>{
    res.send('Hi from api/users/signout');
})

export { router as signoutRouter };