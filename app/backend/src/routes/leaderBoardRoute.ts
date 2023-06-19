import { Request, Router, Response } from 'express';
import 'express-async-errors';
import LeaderBoardController from '../controllers/LeaderBoardController';

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => LeaderBoardController.getFinishedMatchesHome(req, res),
);

router.get(
  '/away',
  (req: Request, res: Response) => LeaderBoardController.getFinishedMatchesAway(req, res),
);

export default router;
