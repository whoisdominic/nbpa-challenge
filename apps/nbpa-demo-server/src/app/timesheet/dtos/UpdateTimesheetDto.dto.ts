import { PartialType } from '@nestjs/swagger';
import { CreateTimesheetDto } from './CreateTimesheetDto.dto';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {}
