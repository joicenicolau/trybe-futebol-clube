import { ILeaderBoard } from '../Interfaces/ILeaderBoard';

// recebe um array de objetos ILeaderBoard como parâmetro e retorna o mesmo array, porém ordenado.
export default (teams: ILeaderBoard[]): ILeaderBoard[] => (
  teams.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    return b.goalsFavor - a.goalsFavor;
  })
);
