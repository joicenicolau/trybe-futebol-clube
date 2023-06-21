import TeamModel from '../database/models/TeamModel';
import { ITeams } from '../Interfaces/team/ITeam';

export default class TeamService {
  private static _model = TeamModel;

  public static async getAllTeams(): Promise<ITeams[]> {
    const allTeams = await TeamService._model.findAll();
    return allTeams;
  }

  public static async getTeamById(pk: number): Promise<ITeams> {
    const team = await TeamService._model.findByPk(pk);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }
}
