// import { ServiceResponse } from '../Interfaces/ServiceResponse';
// import IMatch from '../Interfaces/match/IMatch';
// import MatchModel from '../database/models/MatchModel';
// import Team from '../database/models/TeamModel';

// const INCLUDE_OPTIONS = {
//   include: [
//     {
//       model: Team,
//       as: 'homeTeam',
//       attributes: { exclude: ['id'] },
//     },
//     {
//       model: Team,
//       as: 'awayTeam',
//       attributes: { exclude: ['id'] },
//     },
//   ],
// };

// class MatchService {
//   // todas as partidas que vem do db, incluindo teamHome a teamAway
//   public static async getAllMatches(): Promise<IMatch[]> {
//     return MatchModel.findAll(INCLUDE_OPTIONS);
//   }

//   // recebe as partidas conforme o progreesso
//   public static async getMatchesByProgress(inProgress: boolean): Promise<IMatch[]> {
//     if (typeof inProgress !== 'boolean') {
//       throw new Error('Invalid inProgress value');
//     }

//     const matches = await MatchModel.findAll({
//       ...INCLUDE_OPTIONS,
//       where: { inProgress },
//     });

//     return matches;
//   }

//   public static async updateMatchById(id: number):
//   Promise<ServiceResponse<{ message: string }>> {
//     await MatchModel.update({ inProgress: false }, { where: { id } });
//     return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
//   }

//   public static async update(id: number, homeTeamGoals: number, awayTeamGoals: number):
//   Promise<ServiceResponse<{ message: string }>> {
//     await MatchModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
//     return { status: 'SUCCESSFUL', data: { message: 'Updated' } };
//   }

//   public static async create(match: IMatch): Promise<ServiceResponse<IMatch | ServiceMessage>> {
//     const newMatch = {
//       ...match,
//       inProgress: true,
//     };

//     try {
//       const createdMatch = await MatchModel.create(newMatch);
//       const responseData: IMatch = {
//         id: createdMatch.id,
//         homeTeamId: createdMatch.homeTeamId,
//         homeTeamGoals: createdMatch.homeTeamGoals,
//         awayTeamId: createdMatch.awayTeamId,
//         awayTeamGoals: createdMatch.awayTeamGoals,
//         inProgress: createdMatch.inProgress,
//       };

//       return { status: 'CREATED', data: responseData };
//     } catch (error) {
//       return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
//     }
//   }
// }

// export default MatchService;

import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';
import IMatch from '../Interfaces/match/IMatch';
import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';
// import mapStatusHTTP from '../utils/mapStatusHTTP';

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

  public static create = async (match: IMatch):
  Promise<ServiceResponse<IMatch | ServiceMessage>> => {
    const newMatchData = {
      ...match,
      inProgress: true,
    };

    const newMatch = await MatchModel.create(newMatchData);

    return { status: 'CREATED', data: newMatch };
  };
}

export default MatchService;
