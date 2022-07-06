import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SendAdminMessageDto {
  @ApiProperty({ default: 'admin' })
  @IsString()
  @Length(1, 1000, {message: 'User Name must be between 1 and 1000 symbols in length'})
  message: string;
  @ApiProperty({ default: 'test@email.com' })
  @IsString()
  @IsEmail()
  receiverEmail: string;
}
