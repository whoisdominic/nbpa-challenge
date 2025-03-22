import { Injectable } from '@nestjs/common';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { Timesheet } from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>
  ) {}

  create(createTimesheetDto: CreateTimesheetDto) {
    return this.timesheetRepository.save(createTimesheetDto);
  }

  findAll(skip?: number, take?: number) {
    return this.timesheetRepository.find({ skip, take });
  }

  findByClient(client: string, skip?: number, take?: number) {
    return this.timesheetRepository.find({
      where: { client },
      skip,
      take,
    });
  }

  findOneById(id: number) {
    return this.timesheetRepository.findOneBy({ id });
  }

  update(id: number, updateTimesheetDto: UpdateTimesheetDto) {
    return this.timesheetRepository.update(id, updateTimesheetDto);
  }

  remove(id: number) {
    return this.timesheetRepository.delete(id);
  }
}
