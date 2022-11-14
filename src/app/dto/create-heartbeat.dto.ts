import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateHeartbeatDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  meta: any;
}
