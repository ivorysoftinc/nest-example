import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenBodyDto {
  @ApiProperty({ default: 'fasdfas-fsad-fsa-f-asf-sfasdfasfdsafdas-fas' })
  @IsString()
  refreshToken: string;
}

export class RefreshTokenHeadersDto {
  @ApiProperty({ default: 'fasdfas-fsad-fsa-f-asf-sfasdfasfdsafdas-fas' })
  @IsString()
  authorization: string;
}
