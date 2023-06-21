import * as jwt from 'jsonwebtoken';
import { IUser } from '../Interfaces/user/IUser';
import { TokenGenerate } from '../Interfaces/token/TokenGenerate';

export default class AuthJWTService implements TokenGenerate {
  private jwt = jwt;

  generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, 'jwt_secret');
    return token;
  }

  async validate(token: string): Promise<number | null> {
    try {
      const decoded = this.jwt.verify(token, 'jwt_secret') as { id: number };
      return decoded.id;
    } catch (error) {
      return null;
    }
  }
}
