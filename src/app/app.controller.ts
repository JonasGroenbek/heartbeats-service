import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateHeartbeatDto } from './dto/create-heartbeat.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getGroups() {
    return await this.appService.getGroups({ withHeartbeatCount: true });
  }

  @Get(':group')
  async getHeartbeats(@Param('group') group: string) {
    return await this.appService.getHeartbeats({ group });
  }

  @Delete(':group/:id')
  async deleteHeartbeat(
    @Param('group') group: string,
    @Param('id') id: string,
  ) {
    return await this.appService.deleteHeartbeat({ group, id });
  }

  @Post(':group/:id')
  async createHeartbeat(
    @Param('group') group: string,
    @Param('id') id: string,
    @Body() body: CreateHeartbeatDto,
  ) {
    return this.appService.createHeartbeat({ group, id, ...body });
  }
}
