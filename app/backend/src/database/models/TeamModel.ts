import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class TeamModel extends Model<InferAttributes<TeamModel>, InferCreationAttributes<TeamModel>> {
  id!: CreationOptional<number>;
  teamName!: string;
}

TeamModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'team_name',
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Teams',
  timestamps: false,
});

export default TeamModel;
