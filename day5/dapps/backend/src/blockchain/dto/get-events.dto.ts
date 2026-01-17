import { ApiProperty } from '@nestjs/swagger';

export class GetEventsDto {
  @ApiProperty({ example: 0 })
  fromBlock: number;

  @ApiProperty({ example: 0 })
  toBlock: number;
}
