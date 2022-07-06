import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class LoginBySessionDto {
  @ApiProperty({ default: 'admin' })
  @IsString()
  sessionKey: string;

  @ApiProperty({ default: '66a74ad1-ebf0-46a5-b71b-40a08a1bd42a' })
  @IsString()
  @IsUUID()
  sessionId: string;
}
