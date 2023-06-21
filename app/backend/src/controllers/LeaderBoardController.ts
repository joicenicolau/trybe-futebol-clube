import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBoardService';
import TeamService from '../services/TeamService';
import { ITeams } from '../Interfaces/team/ITeam';
import sortMatches from '../utils/sort';

const ERROR_MESSAGE = 'Internal server error';

export default class LeaderboardController {
  static async getMatchesHome(_req: Request, res: Response) {
    try {
      const allTeams = await TeamService.getAllTeams();
      const matchHome = await Promise.all(
        allTeams.map(async (team: ITeams) =>
          LeaderBoardService.getMatchesHome(team.id || 0)),
      );
      return res.status(200).json(sortMatches(matchHome));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: ERROR_MESSAGE });
    }
  }

  static async getMatchesAway(_req: Request, res: Response) {
    try {
      const allTeams = await TeamService.getAllTeams();
      const matchAway = await Promise.all(
        allTeams.map(async (team: ITeams) =>
          LeaderBoardService.getMatchesAway(team.id || 0)),
      );
      return res.status(200).json(sortMatches(matchAway));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: ERROR_MESSAGE });
    }
  }

  static async getMatches(_req: Request, res: Response) {
    try {
      const allTeams = await TeamService.getAllTeams();
      const allFinishedMatches = await Promise.all(
        allTeams.map(async (team: ITeams) =>
          LeaderBoardService.getMatches(team.id || 0)),
      );
      return res.status(200).json(sortMatches(allFinishedMatches));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: ERROR_MESSAGE });
    }
  }
}
