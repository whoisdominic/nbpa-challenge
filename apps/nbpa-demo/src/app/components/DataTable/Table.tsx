import styled from 'styled-components';
import { useDataTable } from './useDataTable';
import { colorScheme } from '../../constants';
import { useMemo } from 'react';

interface ProjectSummary {
  name: string;
  client: string;
  totalHours: number;
  billableHours: number;
  billableAmount: number;
}

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1200px;
  max-width: 90vw;
`;

const SummaryContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const SummaryText = styled.span`
  color: ${colorScheme.white};
  font-size: 0.875rem;
`;

const TableContainer = styled.div`
  border-radius: 8px;
  overflow: auto;
  width: 100%;
  height: 80vh;
  min-height: 80vh;
  box-shadow: 0 0 0 1px ${colorScheme.white};
`;

const StyledTable = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHead = styled.thead`
  background-color: ${colorScheme.white};
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: ${colorScheme.primary};
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody`
  background-color: ${colorScheme.primary};
`;

const TableRow = styled.tr<{ isLast?: boolean }>`
  border-bottom: 1px solid ${colorScheme.white};
  ${({ isLast }) => isLast && `border-bottom: none;`}
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: ${colorScheme.white};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  background-color: ${colorScheme.primary};
`;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const Table = () => {
  const {
    data: timesheets,
    activeClient,
    setClient,
  } = useDataTable({ take: 20, skip: 0 });

  // Group and summarize data by project
  const projectSummaries = useMemo(() => {
    return timesheets.reduce((acc: ProjectSummary[], entry) => {
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

  return (
    <ViewContainer>
      <SummaryContainer>
        <SummaryText>Client: {activeClient}</SummaryText>
      </SummaryContainer>
      <TableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Clients</TableHeaderCell>
              <TableHeaderCell>Hours</TableHeaderCell>
              <TableHeaderCell>Billable Hours</TableHeaderCell>
              <TableHeaderCell>Billable Amount</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectSummaries.map((summary, index) => (
              <TableRow
                key={index}
                isLast={index === projectSummaries.length - 1}
              >
                <TableCell>{summary.name}</TableCell>
                <TableCell
                  onClick={() => setClient(summary.client)}
                  style={{ minWidth: '120px' }}
                >
                  {summary.client}
                </TableCell>
                <TableCell>{summary.totalHours.toFixed(2)}</TableCell>
                <TableCell>{summary.billableHours.toFixed(2)}</TableCell>
                <TableCell>{formatCurrency(summary.billableAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </ViewContainer>
  );
};

export default Table;
