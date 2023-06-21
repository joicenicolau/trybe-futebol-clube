import { Request, Router, Response } from 'express';
import 'express-async-errors';
import TeamController from '../controllers/TeamController';

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => TeamController.getAllTeams(req, res),
);

router.get(
  '/:id',
  (req: Request, res: Response) => TeamController.getTeamById(req, res),
);

export default router;
