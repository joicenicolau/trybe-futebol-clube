import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  public static async getAllTeams(_req: Request, res: Response) {
    const serviceResponse = await TeamService.getAllTeams();

    return res.status(200).json(serviceResponse);
  }

  public static async getTeamById(req: Request, res: Response) {
    const serviceResponse = await TeamService.getTeamById(Number(req.params.id));

    return res.status(200).json(serviceResponse);
  }
}
