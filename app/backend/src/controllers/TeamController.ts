import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) { }

  public async getAllTeams(_req: Request, res: Response) {
    const serviceResponse = await this.teamService.getAllTeams();

    return res.status(200).json(serviceResponse);
  }

  public async getTeamById(req: Request, res: Response) {
    const serviceResponse = await this.teamService.getTeamById(Number(req.params.id));

    return res.status(200).json(serviceResponse);
  }
}

export default TeamController;
