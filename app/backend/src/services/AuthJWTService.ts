// pesquisa https://github.com/tryber/sd-027-a-live-lectures/blob/lecture/back/10.1/src/services/TokenGeneratorJwt.ts
import * as jwt from 'jsonwebtoken';
import { IUser } from '../Interfaces/user/IUser';
import { TokenGenerate } from '../Interfaces/token/TokenGenerate';

export default class AuthJWTService implements TokenGenerate {
  private jwt = jwt;

  generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, 'jwt_secret');
    return token;
  }
}
