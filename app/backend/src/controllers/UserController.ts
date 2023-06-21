import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(
    private userService: UserService,
  ) { }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const serviceResponse = await this.userService.login(email, password);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

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
