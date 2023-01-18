import { BeforeSave, BeforeUpdate, Column, DataType, Model, Table, Unique } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import Sequelize from 'sequelize';
import { Role } from '../common/roles';
import { enumValidate } from '../common/helpers';

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

  @Unique({
    name: 'email',
    msg: 'user with this email already exists',
  })
  @Column(DataType.STRING)
  email: string;

  @Column({
    type: DataType.STRING,
    validate: { isEnum: enumValidate(Role) },
    defaultValue: Role.User,
  })
  role: string;

  @Column({ type: DataType.STRING })
  password: string;

  publicFields: () => any;

  @BeforeUpdate
  @BeforeSave
  public static async password(user: User) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  }
}

User.prototype.publicFields = function () {
  const userObject = { ...this.dataValues };
  delete userObject.password;
  return userObject;
};
