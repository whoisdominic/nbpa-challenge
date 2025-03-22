import styled from 'styled-components';
import { Table } from './DataTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledApp>
        <Table />
      </StyledApp>
    </QueryClientProvider>
  );
}

export default App;
