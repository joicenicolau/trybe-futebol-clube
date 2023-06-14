import { TokenGenerate } from '../Interfaces/token/TokenGenerate';
import { Encrypter } from '../Interfaces/token/Encrypter';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import AuthJWTService from './AuthJWTService';

export default class UserService {
  constructor(
    // recebe as instancias
    private userModel: typeof UserModel,
    private encrypter: Encrypter,
    private tokenGenerator: AuthJWTService | TokenGenerate,
  ) {}

  // pesquisa: https://github.com/tryber/sd-027-a-live-lectures/blob/lecture/back/10.1/src/services/UserService.ts
  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const isValid = await this.encrypter.compare(password, user.password);

    if (!isValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = this.tokenGenerator.generate(user);

    return { status: 'SUCCESSFUL', data: { token } };
  }

  // método público que recebe um param authorization que é string ou undefined
  public async getRole(authorization: string | undefined): Promise<ServiceResponse<string>> {
    // se o tipo de authorization não é uma string não tem token ou está incorreto
    if (typeof authorization !== 'string') {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid token' } };
    }
    // chama o validare do tokengenerator para validar o token
    const id = await this.tokenGenerator.validate(authorization);

    if (id === null) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid token' } };
    }

    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    }

    return { status: 'SUCCESSFUL', data: user.role };
  }
}
