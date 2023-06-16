import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchesController {
  static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress === 'true') {
      const response = await MatchService.getMatchesByProgress(true);
      return res.status(200).json(response);
    }

    if (inProgress === 'false') {
      const response = await MatchService.getMatchesByProgress(false);
      return res.status(200).json(response);
    }

    const response = await MatchService.getAllMatches();
    return res.status(200).json(response);
  }
}
