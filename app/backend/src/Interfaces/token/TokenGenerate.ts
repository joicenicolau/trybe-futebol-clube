import { IUser } from '../user/IUser';

export interface TokenGenerate {
  generate(user: IUser): string
}
