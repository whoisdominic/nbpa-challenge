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
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';

@Controller('timesheet')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  create(@Body() createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetService.create(createTimesheetDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.timesheetService.findOneById(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimesheetDto: UpdateTimesheetDto
  ) {
    return this.timesheetService.update(+id, updateTimesheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timesheetService.remove(+id);
  }
}
