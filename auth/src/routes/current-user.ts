import express,{Request, Response, NextFunction} from 'express';
import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser',currentUser, (req: Request, res: Response, next: NextFunction)=>{
  res.send({ currentUser: req.currentUser || null });
})

export { router as currentUserRouter };