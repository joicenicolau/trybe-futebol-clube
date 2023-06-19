import MatchModel from '../database/models/MatchModel';
import IMatch from '../Interfaces/match/IMatch';
import { ITeams } from '../Interfaces/team/ITeam';
import { ILeaderBoard } from '../Interfaces/ILeaderBoard';
import TeamModel from '../database/models/TeamModel';

// acumulador inicial
const INTIAL_STATE = {
  countVictories: 0,
  countDraws: 0,
  countGoalsFavor: 0,
  countGoalsOwn: 0,
};

export default class LeaderBoardService {
  public static getAllTeams(): Promise<ITeams[]> {
    return TeamModel.findAll();
  }

  public static async getTeamById(id: number): Promise<ITeams> {
    const response = await TeamModel.findByPk(id) as unknown as ITeams;
    return response;
  }

  private static calcMatchHome(matches: IMatch[]) {
    // reduce no array matches, onde cada partida é iterada para calcular os valores acc.
    return matches.reduce(
      (acc, curr) => {
        const { countVictories, countDraws, countGoalsFavor, countGoalsOwn } = acc;
        // Num de gols da equipe da casa e da equipe visitante
        const homeGoals = curr.homeTeamGoals;
        const awayGoals = curr.awayTeamGoals;
        // Atualizar os nums com base nos gols
        return {
          // num de vitórias é incrementado em 1 se a equipe da casa tiver marcado mais gols do que a equipe visitante
          countVictories: countVictories + (homeGoals > awayGoals ? 1 : 0),
          // num de empates é incrementado em 1 se a equipe da casa tiver marcado mesma qtidade de gols do que a equipe visitante
          countDraws: countDraws + (homeGoals === awayGoals ? 1 : 0),
          countGoalsFavor: countGoalsFavor + homeGoals,
          countGoalsOwn: countGoalsOwn + awayGoals,
        };
      },
      {
        ...INTIAL_STATE,
      },
    );
  }

  public static async getFinishedMatchesHome(id: number): Promise<ILeaderBoard> {
    // Encontrar todas as partidas em que inProgress é false e homeTeamId corresponde ao id passado
    const matches = await MatchModel.findAll({ where: { inProgress: false, homeTeamId: id } });
    // pegar as infos de teams para o id passado
    const teams = await LeaderBoardService.getTeamById(id);
    // Calcular estatísticas da partida usando o método calcMatch
    const { countDraws, countVictories, countGoalsFavor, countGoalsOwn,
    } = LeaderBoardService.calcMatchHome(matches);
    // Calc num total de jogos
    const totalGames = matches.length;
    // Calc num total de vitórias + empates
    const totalPoints = countVictories * 3 + countDraws;
    const goalsBalance = countGoalsFavor - countGoalsOwn;
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    // obj com as infos
    return { name: teams.teamName,
      totalPoints,
      totalGames,
      totalVictories: countVictories,
      totalDraws: countDraws,
      totalLosses: totalGames - countVictories - countDraws,
      goalsFavor: countGoalsFavor,
      goalsOwn: countGoalsOwn,
      goalsBalance,
      efficiency };
  }

  private static calcMatchAway(matches: IMatch[]) {
    return matches.reduce(
      (acc, curr) => {
        const { countVictories, countDraws, countGoalsFavor, countGoalsOwn } = acc;

        const homeGoals = curr.homeTeamGoals;
        const awayGoals = curr.awayTeamGoals;

        return {
          countVictories: countVictories + (homeGoals < awayGoals ? 1 : 0),
          countDraws: countDraws + (homeGoals === awayGoals ? 1 : 0),
          countGoalsFavor: countGoalsFavor + homeGoals,
          countGoalsOwn: countGoalsOwn + awayGoals,
        };
      },
      {
        ...INTIAL_STATE,
      },
    );
  }

  public static async getFinishedMatchesAway(id: number): Promise<ILeaderBoard> {
    const matches = await MatchModel.findAll({ where: { inProgress: false, awayTeamId: id } });
    const teams = await LeaderBoardService.getTeamById(id);
    const { countDraws, countVictories, countGoalsFavor, countGoalsOwn,
    } = LeaderBoardService.calcMatchAway(matches);
    const totalGames = matches.length;
    const totalPoints = countVictories * 3 + countDraws;
    const goalsBalance = countGoalsOwn - countGoalsFavor;
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return { name: teams.teamName,
      totalPoints,
      totalGames,
      totalVictories: countVictories,
      totalDraws: countDraws,
      totalLosses: totalGames - countVictories - countDraws,
      goalsFavor: countGoalsOwn,
      goalsOwn: countGoalsFavor,
      goalsBalance,
      efficiency };
  }
}
