import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'date' })
  date: Date = new Date();

  @Column()
  client: string = '';

  @Column()
  project: string = '';

  @Column()
  projectCode: string = '';

  @Column({ type: 'float' })
  hours: number = 0;

  @Column()
  billable: boolean = false;

  @Column()
  firstName: string = '';

  @Column()
  lastName: string = '';

  @Column({ type: 'float' })
  billableRate: number = 0;
}
