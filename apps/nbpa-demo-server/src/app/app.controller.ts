import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Checks if the API is running',
  })
  @ApiTags('Health')
  @ApiResponse({ status: 200, description: 'API is healthy' })
  healthCheck() {
    return this.appService.healthCheck();
  }
}
