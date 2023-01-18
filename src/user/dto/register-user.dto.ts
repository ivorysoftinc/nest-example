import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ default: 'admin' })
  @IsString()
  @Length(2, 32, {
    message: 'User Name must be between 6 and 32 symbols in length',
  })
  name: string;
  @ApiProperty({ default: 'test@email.com' })
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({ default: 'password' })
  @IsString()
  @Length(6, 32, {
    message: 'User Password must be between 6 and 32 symbols in length',
  })
  password: string;
}
