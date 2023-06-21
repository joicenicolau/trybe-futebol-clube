import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import TeamModel from '../database/models/TeamModel';

export default class Validations {
  public static async validateLogin(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
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

  public static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      const secret = process.env.JWT_SECRET || '';
      jwt.verify(authorization, secret);
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    return next();
  }

  public static async validateMatches(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const { homeTeamId, awayTeamId } = req.body;

    if (homeTeamId === awayTeamId) {
      return res
        .status(422).json({ message: 'It is not possible to create a match with two equal teams' });
    }

    try {
      const [homeTeam, awayTeam] = await Promise.all([
        TeamModel.findByPk(homeTeamId),
        TeamModel.findByPk(awayTeamId),
      ]);

      if (!homeTeam || !awayTeam) {
        return res.status(404).json({ message: 'There is no team with such id!' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    return next();
  }
}
