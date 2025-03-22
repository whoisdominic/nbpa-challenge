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
  width: 1200px;
  max-width: 90vw;
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

const ClientText = styled(motion.span)<{ colored?: boolean }>`
  color: ${({ colored }) =>
    colored ? colorScheme.white : colorScheme.primary};
  font-size: 1.5rem;
  font-weight: 800;
`;

const ClientExit = styled(motion.span)`
  cursor: pointer;
  font-size: 1.5rem;
`;

// Table
//
const TableContainer = styled(motion.div)`
  border-radius: 8px;
  overflow: auto;
  width: 100%;
  height: 80vh;
  min-height: 80vh;
  box-shadow: 0 0 0 1px ${colorScheme.white};
`;

const StyledTable = styled(motion.table)`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHead = styled(motion.thead)`
  background-color: ${colorScheme.white};
`;

const TableHeaderCell = styled(motion.th)`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: ${colorScheme.primary};
  letter-spacing: 0.05em;
`;

const TableBody = styled(motion.tbody)`
  background-color: ${colorScheme.primary};
`;

const TableRow = styled(motion.tr)<{ isLast?: boolean }>`
  border-bottom: 1px solid ${colorScheme.white};
  ${({ isLast }) => isLast && `border-bottom: none;`}
`;

const TableCell = styled(motion.td)<{ isZero?: boolean }>`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
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
    setClient,
    totalHours,
    totalBillableAmount,
    projectSummaries,
  } = useDataTable({ take: 10, skip: 0 });

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
        <ClientText variants={fadeIn}>Client:</ClientText>
        <ClientText colored variants={fadeIn}>
          {activeClient}
        </ClientText>
        {activeClient && (
          <ClientExit variants={fadeIn} onClick={() => setClient(undefined)}>
            ❌
          </ClientExit>
        )}
      </ClientContainer>
      <TableContainer variants={fadeIn}>
        <StyledTable variants={fadeIn}>
          <TableHead variants={fadeIn}>
            <TableRow variants={fadeIn}>
              <TableHeaderCell variants={fadeIn}>Name</TableHeaderCell>
              <TableHeaderCell variants={fadeIn}>Clients</TableHeaderCell>
              <TableHeaderCell variants={fadeIn}>Hours</TableHeaderCell>
              <TableHeaderCell variants={fadeIn}>
                Billable Hours
              </TableHeaderCell>
              <TableHeaderCell variants={fadeIn}>
                Billable Amount
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody variants={fadeIn}>
            {projectSummaries.map((summary, index) => (
              <TableRow
                key={index}
                isLast={index === projectSummaries.length - 1}
                variants={fadeIn}
              >
                <TableCell variants={fadeIn}>{summary.name}</TableCell>
                <TableCell
                  onClick={() => setClient(summary.client)}
                  style={{ minWidth: '120px' }}
                  variants={fadeIn}
                >
                  {summary.client}
                </TableCell>
                <TableCell variants={fadeIn}>
                  {summary.totalHours.toFixed(2)}
                </TableCell>
                <TableCell variants={fadeIn}>
                  {summary.billableHours.toFixed(2)}
                </TableCell>
                <TableCell variants={fadeIn}>
                  {formatCurrency(summary.billableAmount, true)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </ViewContainer>
  );
};

export default Table;
