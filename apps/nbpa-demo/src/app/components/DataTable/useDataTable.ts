import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timesheetService } from '../../timesheetService';
import { CreateTimesheetDto } from '@nbpa-demo/types';

interface UseDataTableProps {
  mode?: {
    client?: string;
    skip?: number;
    take?: number;
  };
}

export function useDataTable({ mode }: UseDataTableProps = {}) {
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ['timesheets', mode],
    queryFn: () => {
      const params = {
        skip: mode?.skip ?? 0,
        take: mode?.take ?? 20,
        ...(mode?.client && { client: mode.client }),
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
    data,
    createTimesheet: createMutation.mutate,
  };
}

export default useDataTable;
