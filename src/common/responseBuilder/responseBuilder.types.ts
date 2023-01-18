import { ApiProperty } from '@nestjs/swagger';

class Error {
  @ApiProperty({ default: 'Some error message' })
  message: string;
  @ApiProperty({ default: 400 })
  code: number;
}

export class ResponseBuilderType {
  @ApiProperty({ description: 'Indication of success/failed response' })
  result: boolean;
  @ApiProperty({ description: 'Error description or null' })
  error: Error | null;
  @ApiProperty({ default: 'Response data, null if error' })
  data: any;
}
