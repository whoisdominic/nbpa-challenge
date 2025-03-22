import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '../../timesheetService';
import { CreateTimesheetDto, TimeEntry } from '@nbpa-demo/types';
import { useMemo, useState } from 'react';

interface UseDataTableProps {
  skip?: number;
  take?: number;
}

interface ProjectSummary {
  name: string;
  client: string;
  totalHours: number;
  billableHours: number;
  billableAmount: number;
}

export function useDataTable({ skip, take }: UseDataTableProps = {}) {
  const queryClient = useQueryClient();
  const [client, setClient] = useState<string | undefined>(undefined);

  const {
    isPending,
    error,
    data: timesheets,
  } = useQuery<TimeEntry[]>({
    queryKey: ['timesheets', client],
    queryFn: () => {
      const params = {
        skip: skip ?? 0,
        take: take ?? 20,
        ...(client && { client: client }),
      };
      return timesheetService.getAllTimesheets(
        params.skip,
        params.take,
        params.client
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: (newTimesheet: CreateTimesheetDto) =>
      timesheetService.createTimesheet(newTimesheet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  // Group and summarize data by project
  const projectSummaries = useMemo(() => {
    return timesheets?.reduce((acc: ProjectSummary[], entry) => {
      const existingProject = acc.find((p) => p.name === entry.project);

      if (existingProject) {
        existingProject.totalHours += entry.hours;
        if (entry.billable) {
          existingProject.billableHours += entry.hours;
          existingProject.billableAmount += entry.hours * entry.billableRate;
        }
      } else {
        acc.push({
          name: entry.project,
          client: entry.client,
          totalHours: entry.hours,
          billableHours: entry.billable ? entry.hours : 0,
          billableAmount: entry.billable ? entry.hours * entry.billableRate : 0,
        });
      }
      return acc;
    }, []);
  }, [timesheets]);

  const totalHours = useMemo(
    () =>
      projectSummaries?.reduce(
        (sum, project) =>
          client
            ? project.client === client
              ? sum + project.totalHours
              : sum
            : sum + project.totalHours,
        0
      ),
    [projectSummaries, client]
  );

  const totalBillableAmount = useMemo(
    () =>
      projectSummaries?.reduce(
        (sum, project) =>
          client
            ? project.client === client
              ? sum + project.billableAmount
              : sum
            : sum + project.billableAmount,
        0
      ),
    [projectSummaries, client]
  );

  return {
    isPending,
    error,
    data: timesheets ?? [],
    createTimesheet: createMutation.mutate,
    setClient,
    activeClient: client,
    totalHours: totalHours ?? 0,
    totalBillableAmount: totalBillableAmount ?? 0,
    projectSummaries: projectSummaries ?? [],
  };
}

export default useDataTable;
