import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyLoginDto {
  @ApiProperty({ default: 'hjklaf0-asdkfoj3kajfsd-0pfjokasldfjks' })
  @IsString()
  token: string;
}
