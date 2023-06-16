import * as sinon from 'sinon';
import * as chai from 'chai';
import { Request, Response, NextFunction } from 'express';
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import UserService from '../services/UserService';
import UserController from '../controllers/UserController';
import { mockToken, userMock } from './mock/login.mock';
import AuthJWTService from '../services/AuthJWTService';
import EncrypterBcryptService from '../services/AuthBCryptService';

// @ts-ignore
import chaiHttp = require('chai-http');

// Crie as instâncias das dependências
const userModel = UserModel;
const encrypter = new EncrypterBcryptService();
const tokenGenerator = new AuthJWTService();

// Crie a instância do serviço UserService
const userService = new UserService(userModel, encrypter, tokenGenerator);
const userController = new UserController(userService);


chai.use(chaiHttp);

const { expect } = chai;

describe('/login rotas', () => {
  describe('POST', () => {
    afterEach(() => sinon.restore());

    it('retornar o token, se e-mail e senha estiverem corretos', async () => {
      const user = UserModel.build(userMock);

      sinon
        .stub(UserModel, 'findOne')
        .resolves(user);

      const response = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'secret_admin',
      });

      expect(response.status).to.be.eq(200);
      expect(response.body.token).not.to.be.undefined; 
      expect(response.body.token).to.match(mockToken);
    });

    it('retornar erro de autenticação se o e-mail estiver incorreto', async () => {
      const userModelStub = sinon.stub(UserModel, 'findOne');
      userModelStub.resolves(null);

      const response = await chai.request(app).post('/login').send({
        email: 'joice@admin.com',
        password: 'password',
      });

      expect(response.status).to.be.eq(401);
      expect(response.body.message).to.be.eq('Invalid email or password');
    });

    it('retornar erro de autenticação se a senha estiver incorreta', async () => {
      sinon
        .stub(UserModel, 'findOne')
        .resolves(new UserModel({
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
        }));

      const response = await chai.request(app).post('/login').send({
        email: 'admine@admin.com',
        password: 'senha_incorreta',
      });

      expect(response.status).to.be.eq(401);
      expect(response.body.message).to.be.eq('Invalid email or password');
    });
  });

  describe('GET', () => {
    afterEach(() => sinon.restore());

    it('retornar erro de autenticação se o token for inválido', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userMock as UserModel);

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('authorization', 'token inválido');

      expect(response.status).to.be.eq(401);
      expect(response.body.message).to.be.eq('Token must be a valid token');
    });

    it('retornar erro de autenticação se o não tiver token', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userMock as UserModel);

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('authorization', '');

      expect(response.status).to.be.eq(401);
      expect(response.body.message).to.be.eq('Token not found');
    });

    it('retornar erro de token inválido se não for fornecido um token', async () => {
      const authorizationHeader = undefined;
      
      const response = await userService.getRole(authorizationHeader);
    
      expect(response.status).to.be.equal('UNAUTHORIZED');
      expect(response.data).to.deep.include({message: 'Invalid token'});
    });
    
    it('retornar erro de token inválido se o token for inválido', async () => {
      const authorizationHeader = 'invalid_token';
      
      sinon.stub(tokenGenerator, 'validate').resolves(null);
      
      const response = await userService.getRole(authorizationHeader);
    
      expect(response.status).to.be.equal('UNAUTHORIZED');
      expect(response.data).to.deep.include({message: 'Invalid token'});
    });
    
    it('retornar erro de usuário não encontrado se o usuário não existir', async () => {
      const authorizationHeader = 'valid_token';
      const userId = 1;
      
      sinon.stub(tokenGenerator, 'validate').resolves(userId);
      sinon.stub(userModel, 'findByPk').resolves(null);
      
      const response = await userService.getRole(authorizationHeader);
    
      expect(response.status).to.be.equal('NOT_FOUND');
      expect(response.data).to.deep.include({message: 'User not found'});
    });
    
    it('retornar o role do usuário se o token for válido e o usuário existir', async () => {
      const authorizationHeader = 'valid_token';
      const userId = 1;
      const user = { id: userId, role: 'admin' };
      
      sinon.stub(tokenGenerator, 'validate').resolves(userId);
      
      const response = await userService.getRole(authorizationHeader);
    
      expect(response.status).to.be.equal('SUCCESSFUL');
      expect(response.data).to.be.equal(user.role);
    });
  });

  // describe('UserController', () => {
  //   let userService: UserService;
  //   let userController: UserController;

  //   beforeEach(() => {
  //     userService = new UserService(UserModel, encrypter, tokenGenerator);
  //     userController = new UserController(userService);
  //   });

  //   it('retornar o role do usuário se o token for válido', async () => {
  //     const authorizationHeader = 'valid_token';

  //     // Simulando uma resposta de sucesso do serviço
  //     sinon.stub(userService, 'getRole').resolves({
  //       status: 'SUCCESSFUL',
  //       data: 'admin',
  //     });

  //     const request = { headers: { authorization: authorizationHeader } } as unknown as Request;
  //     const response = { status: sinon.stub(), json: sinon.stub() } as unknown as Response;

  //     await userController.getRole(request, response);

  //     expect(response.status).to.be.deep.equal(200);
  //     expect(response.json).to.be.deep.equal({ role: 'admin' });
  //   });

  //   it('retornar erro 401 se a autorização estiver faltando', async () => {
  //     const request = { headers: {} } as Request;
  //     const response = { status: sinon.stub(), json: sinon.stub() } as  unknown as Response;

  //     await userController.getRole(request, response);

  //     expect(response.status).to.be.deep.equal(401);
  //     expect(response.json).to.be.deep.equal({ message: 'Authorization header missing' });
  //   });

  //   it('retornar erro 401 se o token for inválido', async () => {
  //     const authorizationHeader = 'invalid_token';

  //     // Simulando uma resposta de erro do serviço
  //     sinon.stub(userService, 'getRole').resolves({
  //       status: 'UNAUTHORIZED',
  //       data: { message: 'Invalid token' },
  //     });

  //     const request = { headers: { authorization: authorizationHeader } } as Request;
  //     const response = { status: sinon.stub(), json: sinon.stub() } as unknown as Response;

  //     await userController.getRole(request, response);

  //     expect(response.status).to.be.deep.equal(401);
  //     expect(response.json).to.be.deep.equal({ message: 'Invalid token' });
    // });
});
// }); 


