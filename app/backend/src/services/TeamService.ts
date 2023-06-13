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
}

export default TeamService;
