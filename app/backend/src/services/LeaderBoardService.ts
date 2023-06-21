import MatchModel from '../database/models/MatchModel';
import { ILeaderBoard } from '../Interfaces/ILeaderBoard';
import TeamModel from '../database/models/TeamModel';

const INITIAL_STATE = {
  victories: 0,
  draws: 0,
  goalFavor: 0,
  goalOwn: 0,
};

export default class LeaderBoardService {
  private static calcMatches(matches: MatchModel[], isHome: boolean) {
    return matches.reduce(
      (acc, curr) => {
        const { victories, draws, goalFavor, goalOwn } = acc;
        const homeGoals = curr.homeTeamGoals;
        const awayGoals = curr.awayTeamGoals;

        if (isHome) {
          return { victories: victories + (homeGoals > awayGoals ? 1 : 0),
            draws: draws + (homeGoals === awayGoals ? 1 : 0),
            goalFavor: goalFavor + homeGoals,
            goalOwn: goalOwn + awayGoals };
        } return { victories: victories + (homeGoals < awayGoals ? 1 : 0),
          draws: draws + (homeGoals === awayGoals ? 1 : 0),
          goalFavor: goalFavor + awayGoals,
          goalOwn: goalOwn + homeGoals,
        };
      },
      { ...INITIAL_STATE },
    );
  }

  public static async getMatchesHome(id: number): Promise<ILeaderBoard> {
    const matches = await MatchModel.findAll({ where: { inProgress: false, homeTeamId: id } });
    const team = await TeamModel.findByPk(id) ?? { teamName: '' };
    const { draws, victories, goalFavor, goalOwn,
    } = LeaderBoardService.calcMatches(matches, true);

    const totalGames = matches.length;
    const totalPoints = victories * 3 + draws;
    const goalsBalance = goalFavor - goalOwn;
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return { name: team.teamName,
      totalPoints,
      totalGames,
      totalVictories: victories,
      totalDraws: draws,
      totalLosses: totalGames - victories - draws,
      goalsFavor: goalFavor,
      goalsOwn: goalOwn,
      goalsBalance,
      efficiency };
  }

  public static async getMatchesAway(id: number): Promise<ILeaderBoard> {
    const matches = await MatchModel.findAll({ where: { inProgress: false, awayTeamId: id } });
    const team = await TeamModel.findByPk(id) ?? { teamName: '' };
    const { draws, victories, goalFavor, goalOwn,
    } = LeaderBoardService.calcMatches(matches, false);

    const totalGames = matches.length;
    const totalPoints = victories * 3 + draws;
    const goalsBalance = goalFavor - goalOwn;
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return { name: team.teamName,
      totalPoints,
      totalGames,
      totalVictories: victories,
      totalDraws: draws,
      totalLosses: totalGames - victories - draws,
      goalsFavor: goalFavor,
      goalsOwn: goalOwn,
      goalsBalance,
      efficiency };
  }

  public static async getMatches(id: number): Promise<ILeaderBoard> {
    const homeMatches = await LeaderBoardService.getMatchesHome(id);
    const awayMatches = await LeaderBoardService.getMatchesAway(id);

    return {
      name: homeMatches.name,
      totalPoints: homeMatches.totalPoints + awayMatches.totalPoints,
      totalGames: homeMatches.totalGames + awayMatches.totalGames,
      totalVictories: homeMatches.totalVictories + awayMatches.totalVictories,
      totalDraws: homeMatches.totalDraws + awayMatches.totalDraws,
      totalLosses: homeMatches.totalLosses + awayMatches.totalLosses,
      goalsFavor: homeMatches.goalsFavor + awayMatches.goalsFavor,
      goalsOwn: homeMatches.goalsOwn + awayMatches.goalsOwn,
      goalsBalance: homeMatches.goalsBalance + awayMatches.goalsBalance,
      efficiency: (
        ((homeMatches.totalPoints + awayMatches.totalPoints)
          / ((homeMatches.totalGames + awayMatches.totalGames) * 3))
        * 100
      ).toFixed(2),
    };
  }
}
