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

class MatchService {
  // todas as partidas que vem do db, incluindo teamHome a teamAway
  public static async getAllMatches(): Promise<IMatch[]> {
    return MatchModel.findAll(INCLUDE_OPTIONS);
  }

  // recebe as partidas conforme o progreesso
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
}

export default MatchService;
