import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';

export default class MatchesController {
  public static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    let serviceResponse;

    if (inProgress === 'true') {
      serviceResponse = await MatchService.getMatchesByProgress(true);
    } else if (inProgress === 'false') {
      serviceResponse = await MatchService.getMatchesByProgress(false);
    } else {
      serviceResponse = await MatchService.getAllMatches();
    }

    return res.status(200).json(serviceResponse);
  }

  public static async updateMatchById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await MatchService.updateMatchById(Number(id));

    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const serviceResponse = await MatchService.update(Number(id), homeTeamGoals, awayTeamGoals);

    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse);
  }

  public static async create(req: Request, res: Response) {
    const serviceResponse = await MatchService.create(req.body);

    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
