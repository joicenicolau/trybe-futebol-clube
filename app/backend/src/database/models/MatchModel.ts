import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatchModel extends Model<InferAttributes<MatchModel>, InferCreationAttributes<MatchModel>> {
  id!: CreationOptional<number>;
  homeTeamId!: number;
  homeTeamGoals!: number;
  awayTeamId!: number;
  awayTeamGoals!: number;
  inProgress!: boolean;
}

MatchModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

MatchModel.belongsTo(TeamModel, { foreignKey: 'homeTeam' });
MatchModel.belongsTo(TeamModel, { foreignKey: 'awayTeam' });
TeamModel.hasMany(MatchModel, { foreignKey: 'id', as: 'matches' });

export default MatchModel;
