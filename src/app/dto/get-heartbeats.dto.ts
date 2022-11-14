import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { GetHeartbeatDto } from './get-heartbeat.dto';

export class GetHeartbeatsDto extends GetHeartbeatDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  offset?: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  @Transform((val) => val || 1000)
  @IsInt()
  limit?: number;
}
