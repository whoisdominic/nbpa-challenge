import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { CreateTimesheetDto } from './dtos/CreateTimesheetDto.dto';
import { UpdateTimesheetDto } from './dtos/UpdateTimesheetDto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('timesheet')
@ApiTags('Timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  @ApiOperation({
    summary: 'Create timesheet',
  })
  @ApiResponse({ status: 201, description: 'Timesheet created successfully' })
  create(@Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(createTimesheetDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get timesheets',
    description: 'Retrieve all timesheets with optional filtering',
  })
  @ApiQuery({
    name: 'client',
    required: false,
    description: 'Filter by client name',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip for pagination',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take for pagination',
  })
  @ApiResponse({ status: 200, description: 'Returns list of timesheets' })
  findAll(
    @Query('client') client?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    const skipValue = skip ? parseInt(skip, 10) : undefined;
    const takeValue = take ? parseInt(take, 10) : undefined;

    return client
      ? this.timesheetService.findByClient(client, skipValue, takeValue)
      : this.timesheetService.findAll(skipValue, takeValue);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get timesheet by ID',
  })
  @ApiResponse({ status: 200, description: 'Returns the timesheet' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  findOne(@Param('id') id: string) {
    return this.timesheetService.findOneById(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update timesheet',
  })
  @ApiResponse({ status: 200, description: 'Timesheet updated successfully' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  update(
    @Param('id') id: string,
    @Body() updateTimesheetDto: UpdateTimesheetDto
  ) {
    return this.timesheetService.update(+id, updateTimesheetDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete timesheet',
  })
  @ApiResponse({ status: 200, description: 'Timesheet deleted successfully' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  remove(@Param('id') id: string) {
    return this.timesheetService.remove(+id);
  }
}
