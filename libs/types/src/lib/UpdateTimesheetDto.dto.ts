import { PartialType } from '@nestjs/mapped-types';
import { CreateTimesheetDto } from './CreateTimesheetDto.dto';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) {}
