import styled from 'styled-components';
import { CSSReset, Table } from './components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { colorScheme } from './constants';

const queryClient = new QueryClient();

const StyledApp = styled.div`
  background-color: ${colorScheme.background};
  color: ${colorScheme.white};
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 2rem;
`;

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CSSReset />
      <StyledApp>
        <Table />
      </StyledApp>
    </QueryClientProvider>
  );
}

export default App;
