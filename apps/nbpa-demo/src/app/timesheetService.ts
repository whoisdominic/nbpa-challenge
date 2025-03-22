import { API_URL } from './constants';
import axios from 'axios';
import { CreateTimesheetDto, UpdateTimesheetDto } from '@nbpa-demo/dtos';

class TimesheetService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = API_URL;
  }

  async getAllTimesheets(skip?: number, take?: number, client?: string) {
    const params = { skip, take, client };
    const response = await axios.get(`${this.apiUrl}/timesheet`, { params });
    return response.data;
  }

  async getTimesheetById(id: string) {
    const response = await axios.get(`${this.apiUrl}/timesheet/${id}`);
    return response.data;
  }

  async createTimesheet(data: CreateTimesheetDto) {
    const response = await axios.post(`${this.apiUrl}/timesheet`, data);
    return response.data;
  }

  async updateTimesheet(id: string, data: UpdateTimesheetDto) {
    const response = await axios.put(`${this.apiUrl}/timesheet/${id}`, data);
    return response.data;
  }

  async deleteTimesheet(id: string) {
    const response = await axios.delete(`${this.apiUrl}/timesheet/${id}`);
    return response.data;
  }
}

export const timesheetService = new TimesheetService();

export default timesheetService;
