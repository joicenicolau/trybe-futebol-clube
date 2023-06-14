import TeamModel from '../database/models/TeamModel';
import { ITeams } from '../Interfaces/team/ITeam';

class TeamService {
  // variável para armazenar a model.
  private _model;

  constructor() {
    // atribui a model a variável, dai permite interagir com db
    this._model = TeamModel;
  }

  public async getAllTeams(): Promise<ITeams[]> {
    const allTeams = await this._model.findAll();
    return allTeams;
  }

  public async getTeamById(pk: number): Promise<ITeams> {
    const team = await this._model.findByPk(pk);
    // apesar do req não pedir fiz o erro, vez que o return estava vindo com um erro de undefined
    if (!team) throw new Error('Team not found');
    return team;
  }
}

export default TeamService;
