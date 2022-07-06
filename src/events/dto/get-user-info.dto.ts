import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class GetUserInfoDto {
  @ApiProperty({ default: 'Admin Adminich' })
  @IsString()
  @IsOptional()
  @Length(2, 320)
  message?: string;
}
