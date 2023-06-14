import { TokenGenerate } from '../Interfaces/token/TokenGenerate';
import { Encrypter } from '../Interfaces/token/Encrypter';
// import { IUser } from '../Interfaces/user/IUser';
import UserModel from '../database/models/UserModel';

export default class UserService {
  constructor(
    private userModel: typeof UserModel,
    private encrypter: Encrypter,
    private tokenGenerator: TokenGenerate,
  ) { }

  public async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await this.encrypter.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.tokenGenerator.generate(user);

    return { token };
  }
}
