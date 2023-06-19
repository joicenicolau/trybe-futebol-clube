import { Request, Router, Response } from 'express';
import 'express-async-errors';
import LeaderBoardController from '../controllers/LeaderBoardController';

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => LeaderBoardController.getFinishedMatches(req, res),
);

export default router;
