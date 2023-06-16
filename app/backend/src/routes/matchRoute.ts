import { Request, Router, Response } from 'express';
import 'express-async-errors';
import MatchController from '../controllers/MatchController';
import Validations from '../middlewares/Validations';

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => MatchController.getAllMatches(req, res),
);

router.patch(
  '/:id/finish',
  Validations.validateToken,
  (req: Request, res: Response) => MatchController.updateMatchById(req, res),
);

router.patch(
  '/:id',
  Validations.validateToken,
  (req: Request, res: Response) => MatchController.update(req, res),
);

export default router;
