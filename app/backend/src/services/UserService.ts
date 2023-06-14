import { TokenGenerate } from '../Interfaces/token/TokenGenerate';
import { Encrypter } from '../Interfaces/token/Encrypter';
import UserModel from '../database/models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class UserService {
  constructor(
    // recebe as instancias
    private userModel: typeof UserModel,
    private encrypter: Encrypter,
    private tokenGenerator: TokenGenerate,
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
}
