import { Request, Router, Response } from 'express';
import 'express-async-errors';
import MatchController from '../controllers/MatchController';

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => MatchController.getAllMatches(req, res),
);

export default router;
