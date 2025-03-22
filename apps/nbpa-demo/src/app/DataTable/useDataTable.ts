import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants";

export function useDataTable() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch(`${API_URL}/timesheet`).then((res) =>
        res.json(),
      ),
  })

return {
  isPending,
  error,
  data
}

}
