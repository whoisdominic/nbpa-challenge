import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '../../timesheetService';
import { useMemo, useState } from 'react';
import { CreateTimesheetDto, TimeEntry } from '../../types';

interface TableEntry {
  name: string;
  client: string;
  totalHours: number;
  billableHours: number;
  billableAmount: number;
}
const pageSize = 10;

export function useDataTable() {
  const queryClient = useQueryClient();
  const [client, setClient] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const skip = page * pageSize;
  const {
    isPending,
    error,
    data: timesheets,
  } = useQuery<TimeEntry[]>({
    queryKey: ['timesheets', client, skip, pageSize],
    queryFn: () => {
      const params = {
        skip: skip ?? 0,
        take: pageSize,
        ...(client && { client: client }),
      };
      return timesheetService.getAllTimesheets(
        params.skip,
        params.take,
        params.client
      );
    },
  });

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const selectClient = (client: string | undefined) => {
    setClient(client);
    setPage(0);
    queryClient.invalidateQueries({
      queryKey: ['timesheets', client, skip, pageSize],
    });
  };

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

  const hasNextPage = useMemo(() => {
    return timesheets && timesheets.length === pageSize;
  }, [timesheets]);

  return {
    isPending,
    error,
    timesheets: formattedTimesheets,
    createTimesheet: createMutation.mutate,
    selectClient,
    activeClient: client,
    totalHours,
    totalBillableAmount,
    handlePreviousPage,
    handleNextPage,
    page,
    pageSize,
    hasNextPage,
  };
}

export default useDataTable;
