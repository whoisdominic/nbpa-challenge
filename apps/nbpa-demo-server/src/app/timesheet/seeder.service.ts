import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';
import { Timesheet } from './entities/timesheet.entity';

interface TimesheetCSVRow {
  Date: string;
  Client: string;
  Project: string;
  'Project Code': string;
  Hours: string;
  'Billable?': string;
  'First Name': string;
  'Last Name': string;
  'Billable Rate': string;
}

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepo: Repository<Timesheet>
  ) {}

  private readonly logger = new Logger(SeederService.name);

  async onApplicationBootstrap() {
    const count = await this.timesheetRepo.count();
    if (count === 0) {
      await this.seedTimesheetsFromCSV();
    }
  }

  private async seedTimesheetsFromCSV(): Promise<void> {
    const csvPath = path.resolve(
      './Assessment/Coding_Exercise_Sample_Data.csv'
    );

    const file = fs.readFileSync(csvPath, 'utf8');
    const { data, errors } = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length) {
      this.logger.error('❌ Error parsing CSV:', errors);
      throw new Error('CSV parsing failed.');
    }

    const timesheets: Partial<Timesheet>[] = (data as TimesheetCSVRow[]).map(
      (row) => ({
        date: new Date(row.Date),
        client: row.Client,
        project: row.Project,
        projectCode: row['Project Code'],
        hours: parseFloat(row.Hours),
        billable: row['Billable?'].toLowerCase() === 'no' ? false : true,
        firstName: row['First Name'],
        lastName: row['Last Name'],
        billableRate: parseFloat(row['Billable Rate']),
      })
    );

    await this.timesheetRepo.save(timesheets);
    this.logger.log(`✅ Seeded ${timesheets.length} timesheets`);
  }
}
