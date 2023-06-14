import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { teamsMock, teamMock } from './mock/teams.mock';

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import TeamService from '../services/TeamService';

chai.use(chaiHttp);

const { expect } = chai;

describe('/teams rotas', () => {
  describe('GET', () => {
    afterEach(() => sinon.restore());
  
    it('listar todos os times', async () => {
      sinon
        .stub(TeamModel, 'findAll')
        .resolves(teamsMock as TeamModel[]);
  
      const response = await chai.request(app).get('/teams');
  
      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(teamsMock);
    });

    it('listar um time, buscado pelo id', async () => {
      sinon
        .stub(TeamModel, 'findByPk')
        .resolves(teamMock as unknown as  TeamModel);

      const response = await chai
        .request(app)
        .get(`/teams/${teamMock.id}`);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(teamMock);
    });

    it('um erro "not found", caso o id buscado seja inexistente', async () => {
      const teamId = 100000;
      const data = sinon
        .stub(TeamModel, 'findByPk')
        .resolves(null);
      
      const teamService = new TeamService();
      let error: Error | undefined;
  
      try {
        await teamService.getTeamById(teamId);
      } catch (err: any) {
        error = err;
      }

      expect(data.calledOnceWith(teamId)).to.be.true;
      expect(error).to.be.an('error');
      expect(error?.message).to.equal('Team not found');
    });
  });
});
