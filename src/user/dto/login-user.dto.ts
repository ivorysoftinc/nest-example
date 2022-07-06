import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ default: 'test@email.com' })
  @IsString()
  @IsEmail()
  email: string;
}
