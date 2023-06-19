import { Request, Router, Response } from 'express';
import 'express-async-errors';
import LeaderBoardController from '../controllers/LeaderBoardController';

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => LeaderBoardController.getMatches(req, res),
);

router.get(
  '/home',
  (req: Request, res: Response) => LeaderBoardController.getMatchesHome(req, res),
);

router.get(
  '/away',
  (req: Request, res: Response) => LeaderBoardController.getMatchesAway(req, res),
);

export default router;
