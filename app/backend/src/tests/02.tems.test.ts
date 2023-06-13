import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { teamsMock } from './mock/teams.mock';

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('/teams routes', () => {
  describe('GET', () => {
    afterEach(() => sinon.restore());
  
    it('should list all registered teams', async () => {
      sinon
        .stub(TeamModel, 'findAll')
        .resolves(teamsMock as TeamModel[]);
  
      const response = await chai.request(app).get('/teams');
  
      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(teamsMock);
    });
  });
});
