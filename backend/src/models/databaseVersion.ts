import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface DatabaseVersionAttributes {
  version: string;
  dependsOn?: string;
  appliedAt?: Date;
}

export type DatabaseVersionPk = "version";
export type DatabaseVersionId = DatabaseVersion[DatabaseVersionPk];
export type DatabaseVersionOptionalAttributes = "dependsOn" | "appliedAt";
export type DatabaseVersionCreationAttributes = Optional<DatabaseVersionAttributes, DatabaseVersionOptionalAttributes>;

export class DatabaseVersion extends Model<DatabaseVersionAttributes, DatabaseVersionCreationAttributes> implements DatabaseVersionAttributes {
  version!: string;
  dependsOn?: string;
  appliedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof DatabaseVersion {
    return DatabaseVersion.init({
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    dependsOn: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'depends_on'
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'applied_at'
    }
  }, {
    sequelize,
    tableName: 'database_version',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "database_version_pkey",
        unique: true,
        fields: [
          { name: "version" },
        ]
      },
    ]
  });
  }
}
