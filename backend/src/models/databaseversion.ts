import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface databaseversionAttributes {
  version: string;
  dependson?: string;
  appliedat?: Date;
}

export type databaseversionPk = "version";
export type databaseversionId = databaseversion[databaseversionPk];
export type databaseversionOptionalAttributes = "dependson" | "appliedat";
export type databaseversionCreationAttributes = Optional<databaseversionAttributes, databaseversionOptionalAttributes>;

export class databaseversion extends Model<databaseversionAttributes, databaseversionCreationAttributes> implements databaseversionAttributes {
  version!: string;
  dependson?: string;
  appliedat?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof databaseversion {
    return databaseversion.init({
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    dependson: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appliedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'databaseversion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "databaseversion_pkey",
        unique: true,
        fields: [
          { name: "version" },
        ]
      },
    ]
  });
  }
}
