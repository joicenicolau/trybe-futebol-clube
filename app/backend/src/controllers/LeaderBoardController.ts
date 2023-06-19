import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBoardService';
import TeamService from '../services/TeamService';
import { ITeams } from '../Interfaces/team/ITeam';
import sortMatches from '../utils/sort';

export default class LeaderboardController {
  static async getFinishedMatchesHome(_req: Request, res: Response) {
    try {
      // instancia TeamService, pois ainda não estava fazendo static
      const teamService = new TeamService();
      const teams = await teamService.getAllTeams();
      // pega todas as partidas finalizadas
      const matches = await Promise.all(
        teams.map(async (team: ITeams) => {
          // pegar todos os calcs para as partidas finalizadas
          // O ID da equipe é passado como argumento. Caso o ID seja undefined, é usado o valor 0
          const match = await LeaderBoardService.getFinishedMatchesHome(team.id || 0);
          return match;
        }),
      );
      // ordena as partidas
      return res.status(200).json(sortMatches(matches));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getFinishedMatchesAway(_req: Request, res: Response) {
    try {
      const teamService = new TeamService();
      const teams = await teamService.getAllTeams();
      const matches = await Promise.all(
        teams.map(async (team: ITeams) => {
          const match = await LeaderBoardService.getFinishedMatchesAway(team.id || 0);
          return match;
        }),
      );
      return res.status(200).json(sortMatches(matches));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
