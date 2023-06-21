import TeamModel from '../database/models/TeamModel';
import { ITeams } from '../Interfaces/team/ITeam';

export default class TeamService {
  public static async getAllTeams(): Promise<ITeams[]> {
    const allTeams = await TeamModel.findAll();
    return allTeams;
  }

  public static async getTeamById(pk: number): Promise<ITeams> {
    const team = await TeamModel.findByPk(pk);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }
}
