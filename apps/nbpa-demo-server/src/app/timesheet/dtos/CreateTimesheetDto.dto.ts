import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTimesheetDto {
  @ApiProperty({
    description: 'Date of the timesheet entry',
    example: '2024-03-20',
  })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Client name', example: 'Acme Corp' })
  @IsString()
  client: string;

  @ApiProperty({ description: 'Project name', example: 'Website Redesign' })
  @IsString()
  project: string;

  @ApiProperty({ description: 'Project code identifier', example: 'ACME-001' })
  @IsString()
  projectCode: string;

  @ApiProperty({ description: 'Number of hours worked', example: 8 })
  @IsNumber()
  hours: number;

  @ApiProperty({ description: 'Whether the time is billable', example: true })
  @IsBoolean()
  billable: boolean;

  @ApiProperty({ description: 'First name of the employee', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the employee', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Hourly billable rate', example: 150 })
  @IsNumber()
  billableRate: number;
}
