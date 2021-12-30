import express,{Request, Response, NextFunction} from 'express';
import { requireAuth, currentUser } from '@d-ticket/common'
import { User} from '../models/user';

const router = express.Router();

router.get('/api/users/currentuser',currentUser, (req: Request, res: Response, next: NextFunction)=>{
  res.send({ currentUser: req.currentUser || null });
})

router.get('/api/users/getalluser', async (req, res)=>{
  const users= await User.find({});
  res.send(users);
})

export { router as currentUserRouter };