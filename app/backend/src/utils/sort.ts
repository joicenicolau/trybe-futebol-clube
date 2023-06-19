import { ILeaderBoard } from '../Interfaces/ILeaderBoard';

// recebe um array de objetos ILeaderBoard como parâmetro e retorna o mesmo array, porém ordenado.
export default (teams: ILeaderBoard[]): ILeaderBoard[] => (
  teams.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return b.goalsOwn - a.goalsOwn;
  })
);
