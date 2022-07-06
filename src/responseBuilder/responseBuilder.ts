import { ApiProperty } from '@nestjs/swagger';

class NoError {
  @ApiProperty({ default: '' })
  message: string;
  @ApiProperty({ default: 0 })
  code: number;
}

export class ResponseBuilder {
  @ApiProperty({ default: true })
  result: boolean;
  @ApiProperty()
  error: NoError;
  @ApiProperty({ default: 'Response data' })
  data: any;
}

class Error {
  @ApiProperty({ default: 'Some error message' })
  message: string;
  @ApiProperty({ default: 400 })
  code: number;
}

export class ResponseBuilderFailed {
  @ApiProperty({ default: false })
  result: boolean;
  @ApiProperty()
  error: Error;
  @ApiProperty({})
  data: any;
}
