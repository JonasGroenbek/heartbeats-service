import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetGroupDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @Type(() => String)
  @IsString()
  group?: string;
}
