import { Column, Model, Table, DataType } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import Sequelize from 'sequelize';

@Table({ timestamps: true })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: ['user', 'admin', 'superAdmin'],
    defaultValue: 'user',
  })
  role: string;

  @Column({ type: DataType.STRING })
  password: string;

  publicFields: () => any;
}

User.beforeSave(async (user: User) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

User.prototype.publicFields = function () {
  const userObject: any = { ...this.dataValues };
  delete userObject.userId;
  delete userObject.customerId;
  return userObject;
};
