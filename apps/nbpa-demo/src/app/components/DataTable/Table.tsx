/* eslint-disable jsx-a11y/accessible-emoji */
import styled from 'styled-components';
import { useDataTable } from './useDataTable';
import { colorScheme } from '../../constants';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const ViewContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  max-width: 90vw;
  /* background-color: red; */
  height: 90%;
`;

// Stats
//
const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StatBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled(motion.div)`
  font-size: 0.875rem;
`;

const StatValue = styled(motion.div)`
  font-size: 2rem;
  font-weight: bold;
`;

// Summary
//
const ClientContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  gap: 8px;
  width: 100%;
`;

const ClientText = styled.span<{ colored?: boolean }>`
  color: ${({ colored }) =>
    colored ? colorScheme.white : colorScheme.primary};
  font-size: 1.5rem;
  font-weight: 800;
`;

const ClientExit = styled(motion.span)`
  cursor: pointer;
  font-size: 1.15rem;
  margin-top: 2px;
`;

// Table
//
const TableContainer = styled.div`
  border-radius: 8px;
  overflow: auto;
  width: 100%;
  box-shadow: 0 0 0 1px ${colorScheme.white};
  flex: 1;
  display: flex;
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
  width: 20%;
  min-width: 150px;
`;

const TableBody = styled(motion.tbody)`
  background-color: ${colorScheme.primary};
`;

const TableRow = styled(motion.tr)<{ isLast?: boolean }>`
  border-bottom: 1px solid ${colorScheme.white};
  ${({ isLast }) => isLast && `border-bottom: none;`}
`;

const TableCell = styled.td<{ isZero?: boolean }>`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

// Pagination
const PaginationContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  background-color: ${colorScheme.primary};
  border-radius: 8px;
  border: 1px solid ${colorScheme.white};
  padding: 0.5rem 1rem;
`;

const PaginationButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${colorScheme.white};
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: ${colorScheme.white}20;
  }
`;

const PageInfo = styled(motion.span)`
  font-size: 0.875rem;
  font-weight: 800;
`;

const formatCurrency = (amount: number, handleZero = false) => {
  if (amount === 0 && handleZero) {
    return '-';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const Table = () => {
  const {
    activeClient,
    totalHours,
    totalBillableAmount,
    timesheets,
    selectClient,
    handlePreviousPage,
    handleNextPage,
    page,
    pageSize,
  } = useDataTable();

  return (
    <ViewContainer initial="hidden" animate="visible" variants={fadeIn}>
      <StatsContainer variants={fadeIn}>
        <StatBox variants={fadeIn}>
          <StatLabel variants={fadeIn}>Hours Tracked</StatLabel>
          <StatValue variants={fadeIn}>{totalHours.toFixed(2)}</StatValue>
        </StatBox>
        <StatBox variants={fadeIn}>
          <StatLabel variants={fadeIn}>Billable Amount</StatLabel>
          <StatValue variants={fadeIn}>
            {formatCurrency(totalBillableAmount, false)}
          </StatValue>
        </StatBox>
      </StatsContainer>
      <ClientContainer variants={fadeIn}>
        <ClientText>Client:</ClientText>
        <ClientText colored>{activeClient ?? 'All'}</ClientText>
        {activeClient && (
          <ClientExit variants={fadeIn} onClick={() => selectClient(undefined)}>
            ❌
          </ClientExit>
        )}
      </ClientContainer>
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
          <TableBody variants={fadeIn}>
            {timesheets.map((summary, index) => (
              <TableRow
                key={index}
                isLast={index === timesheets.length - 1}
                variants={fadeIn}
              >
                <TableCell>{summary.name}</TableCell>
                <TableCell
                  onClick={() => selectClient(summary.client)}
                  style={{ minWidth: '120px' }}
                >
                  {summary.client}
                </TableCell>
                <TableCell>{summary.totalHours.toFixed(2)}</TableCell>
                <TableCell>{summary.billableHours.toFixed(2)}</TableCell>
                <TableCell>
                  {formatCurrency(summary.billableAmount, true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
      <PaginationContainer variants={fadeIn}>
        <PaginationButton
          onClick={handlePreviousPage}
          disabled={page === 0}
          variants={fadeIn}
        >
          Prev
        </PaginationButton>
        <PageInfo variants={fadeIn}>{page + 1}</PageInfo>
        <PaginationButton
          onClick={handleNextPage}
          disabled={!timesheets || timesheets.length < pageSize}
          variants={fadeIn}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </ViewContainer>
  );
};

export default Table;
