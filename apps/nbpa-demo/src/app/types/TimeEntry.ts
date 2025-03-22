export interface TimeEntry {
  id: number;
  date: Date;
  client: string;
  project: string;
  projectCode: string;
  hours: number;
  billable: boolean;
  firstName: string;
  lastName: string;
  billableRate: number;
}
