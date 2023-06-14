// pesquisa https://github.com/tryber/sd-027-a-live-lectures/blob/lecture/back/10.1/src/services/EncrypterBcryptService.ts
import * as bcrypt from 'bcryptjs';
import { Encrypter } from '../Interfaces/token/Encrypter';

export default class EncrypterBcryptService implements Encrypter {
  private bcrypt = bcrypt;

  async encrypt(password: string): Promise<string> {
    const hash = await this.bcrypt.hash(password, 10);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = await this.bcrypt.compare(password, hash);
    return isValid;
  }
}
