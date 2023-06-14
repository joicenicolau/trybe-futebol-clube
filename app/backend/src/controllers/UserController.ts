import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(
    private userService: UserService,
  ) { }

  // pesquisa: https://github.com/tryber/sd-027-a-live-lectures/blob/lecture/back/10.1/src/controllers/UserController.ts
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    // cha,a o método Login da service
    const serviceResponse = await this.userService.login(email, password);

    // verifica se não é um erro e se for passa o status e msg
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }
    // se não retorno feliz
    return res.status(200).json(serviceResponse.data);
  }

  public async getRole(req: Request, res: Response): Promise<Response> {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const roleResponse = await this.userService.getRole(authorizationHeader);

    if (roleResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(roleResponse.status)).json(roleResponse.data);
    }

    return res.status(200).json({ role: roleResponse.data });
  }
}
