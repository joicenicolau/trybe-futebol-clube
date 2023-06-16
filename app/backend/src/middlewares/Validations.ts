import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import TeamModel from '../database/models/TeamModel';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const emailRegex = /\S+@\S+.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    // o token vem do header - authorization
    const { authorization } = req.headers;

    // Caso o token não seja informado, deve-se retornar, com um status 401
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      // Define sua chave secreta aqui
      const secret = process.env.JWT_SECRET || '';
      // cha,a a verify do jwt, sendo que pedia 02 params.
      jwt.verify(authorization, secret);
      // se chegar até aqui = sucesso
    } catch (error) {
      //  se não, dá o erro do token não válido
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    return next();
  }

  static async validateMatches(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    try {
      // buscar os times de forma assíncrona.
      const [homeTeam, awayTeam] = await Promise.all([
        TeamModel.findByPk(homeTeamId),
        TeamModel.findByPk(awayTeamId),
      ]);

      if (!homeTeam || !awayTeam) {
        return res.status(404).json({ message: 'There is no team with such id!' });
      }
    } catch (error) {
      // caso veir erro do db
      return res.status(500).json({ message: 'Internal server error' });
    }

    return next();
  }
}

export default Validations;
