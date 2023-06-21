import { TokenGenerate } from '../Interfaces/token/TokenGenerate';
import { Encrypter } from '../Interfaces/token/Encrypter';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import AuthJWTService from './AuthJWTService';

export default class UserService {
  constructor(
    private userModel: typeof UserModel,
    private encrypter: Encrypter,
    private tokenGenerator: AuthJWTService | TokenGenerate,
  ) {}

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

  public async getRole(authorization: string | undefined): Promise<ServiceResponse<string>> {
    if (typeof authorization !== 'string') {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid token' } };
    }

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
