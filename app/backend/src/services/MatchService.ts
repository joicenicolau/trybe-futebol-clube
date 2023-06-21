import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';
import IMatch from '../Interfaces/match/IMatch';
import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';

const INCLUDE_OPTIONS = {
  include: [
    {
      model: Team,
      as: 'homeTeam',
      attributes: { exclude: ['id'] },
    },
    {
      model: Team,
      as: 'awayTeam',
      attributes: { exclude: ['id'] },
    },
  ],
};

export default class MatchService {
  public static async getAllMatches(): Promise<IMatch[]> {
    return MatchModel.findAll(INCLUDE_OPTIONS);
  }

  public static async getMatchesByProgress(inProgress: boolean): Promise<IMatch[]> {
    if (typeof inProgress !== 'boolean') {
      throw new Error('Invalid inProgress value');
    }

    const matches = await MatchModel.findAll({
      ...INCLUDE_OPTIONS,
      where: { inProgress },
    });

    return matches;
  }

  public static async updateMatchById(id: number): Promise<ServiceResponse<ServiceMessage>> {
    await MatchModel.update({ inProgress: false }, { where: { id } });
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public static async update(id: number, homeTeamGoals: number, awayTeamGoals: number):
  Promise<ServiceResponse<ServiceMessage>> {
    await MatchModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return { status: 'SUCCESSFUL', data: { message: 'Updated' } };
  }

  public static async create(match: IMatch): Promise<ServiceResponse<IMatch | ServiceMessage>> {
    const newMatchData = {
      ...match,
      inProgress: true,
    };

    const newMatch = await MatchModel.create(newMatchData);

    return { status: 'CREATED', data: newMatch };
  }
}
