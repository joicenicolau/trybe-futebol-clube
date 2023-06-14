import { IUser } from '../user/IUser';

// contrato dos tokens. Gera e valida
export interface TokenGenerate {
  generate(user: IUser): string;
  validate(token: string): Promise<number | null>;
}
