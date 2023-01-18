import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenBodyDto {
  @ApiProperty({ default: 'eyJhbGciOiJIUz...' })
  @IsString()
  refreshToken: string;
}

export class TokenHeadersDto {
  @ApiProperty({ default: 'Bearer eyJhbGciOiJIUz...', required: false })
  @IsString()
  authorization: string;
}
