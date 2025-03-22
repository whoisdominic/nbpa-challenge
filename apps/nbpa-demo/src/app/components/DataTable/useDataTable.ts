import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '../../timesheetService';
import { CreateTimesheetDto, TimeEntry } from '@nbpa-demo/types';
import { useMemo, useState } from 'react';

interface UseDataTableProps {
  skip?: number;
  take?: number;
}

interface TableEntry {
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

  // Format timesheet entries with calculated billable amounts and filter by client
  const formattedTimesheets = useMemo(() => {
    return (
      timesheets?.reduce((acc, entry) => {
        if (!client || entry.client === client) {
          acc.push({
            name: `${entry.firstName} ${entry.lastName}`,
            client: entry.client,
            totalHours: entry.hours,
            billableHours: entry.billable ? entry.hours : 0,
            billableAmount: entry.billable
              ? entry.hours * entry.billableRate
              : 0,
          });
        }
        return acc;
      }, [] as TableEntry[]) ?? []
    );
  }, [timesheets, client]);

  const totalHours = useMemo(
    () => formattedTimesheets.reduce((sum, entry) => sum + entry.totalHours, 0),
    [formattedTimesheets]
  );

  const totalBillableAmount = useMemo(
    () =>
      formattedTimesheets.reduce((sum, entry) => sum + entry.billableAmount, 0),
    [formattedTimesheets]
  );

  return {
    isPending,
    error,
    timesheets: formattedTimesheets,
    createTimesheet: createMutation.mutate,
    setClient,
    activeClient: client,
    totalHours,
    totalBillableAmount,
  };
}

export default useDataTable;
