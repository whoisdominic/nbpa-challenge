import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '../../timesheetService';
import { CreateTimesheetDto, TimeEntry } from '@nbpa-demo/types';
import { useState } from 'react';

interface UseDataTableProps {
  skip?: number;
  take?: number;
}

export function useDataTable({ skip, take }: UseDataTableProps = {}) {
  const queryClient = useQueryClient();
  const [client, setClient] = useState<string | undefined>(undefined);

  const { isPending, error, data } = useQuery<TimeEntry[]>({
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

  return {
    isPending,
    error,
    data: data ?? [],
    createTimesheet: createMutation.mutate,
    setClient,
    activeClient: client,
  };
}

export default useDataTable;
