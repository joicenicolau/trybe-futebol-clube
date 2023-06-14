import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(
    private userService: UserService,
  ) { }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const serviceResponse = await this.userService.login(email, password);

    if (!serviceResponse) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    return res.status(200).json({ token: serviceResponse.token });
  }
}
