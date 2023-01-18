import { BadRequestException } from '@nestjs/common';

export function enumValidate(enumObject: unknown) {
  return (value) => {
    const isAllowedValue = Object.values(enumObject).includes(value);
    if (!isAllowedValue) throw new BadRequestException(`${value} is not value of enum`);
  };
}
