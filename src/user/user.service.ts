import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { WhereOptions } from 'sequelize/types/model';
import { FindOptions } from '@nestjs/schematics';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async findById(id: string): Promise<Nullable<User>> {
    return this.userModel.findByPk(id);
  }

  public async findOne(filter: WhereOptions, options?: FindOptions): Promise<Nullable<User>> {
    return this.userModel.findOne({ where: filter, ...options });
  }

  public async create(data: Partial<User>): Promise<User> {
    return this.userModel.create({ ...data });
  }
}
