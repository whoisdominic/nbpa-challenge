import { Injectable } from '@nestjs/common';
import { Timesheet } from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTimesheetDto, UpdateTimesheetDto } from '@nbpa-demo/types';

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
