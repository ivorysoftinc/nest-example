import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-new-user.dto';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(@InjectModel(User) private userModel: typeof User) {
    this.logger = new Logger('UserService');
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findOne(filter: any): Promise<User | null> {
    return this.userModel.findOne({ where: filter });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.userModel.create({ ...data });
  }

  async findOneAndUpdate(filter: any, newData: any): Promise<User> {
    const user = await this.userModel.findOne({ where: filter });
    Object.keys(newData).forEach((item) => (user[item] = newData[item]));
    await user.save();
    return user;
  }
}
