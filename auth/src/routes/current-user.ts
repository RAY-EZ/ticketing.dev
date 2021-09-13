import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser',(req,res,next)=>{
    res.send('Hi from api/users/currentuser');
})

export { router as currentUserRouter };