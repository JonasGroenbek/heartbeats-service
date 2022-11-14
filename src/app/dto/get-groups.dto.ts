import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OptionalBoolean } from '../../decorators/optional-boolean';
import { GetGroupDto } from './get-group.dto';

export class GetGroupsDto extends GetGroupDto {
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

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @Type(() => Boolean)
  @OptionalBoolean()
  @IsBoolean()
  withHeartbeatCount?: boolean;
}
