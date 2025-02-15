import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  HStack,
  Select,
  Input,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  StatHelpText,
  StatArrow,
  Center,
  Spinner,
} from '@chakra-ui/react';

interface LogEntry {
  id: number;
  idea: string;
  status: 'success' | 'failed';
  error_message?: string;
  ai_provider: string;
  created_at: string;
  execution_time: number;
  tokens_used?: number;
}

interface LogStats {
  total_queries: number;
  success_rate: number;
  total_tokens: number;
  average_execution_time: number;
  provider_stats: {
    [key: string]: {
      total: number;
      success: number;
      tokens: number;
    }
  }
}

interface LogsTableProps {
  logs: LogEntry[];
  stats: LogStats;
  onFilterChange: (filters: any) => void;
  isLoading?: boolean;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  logs = [],
  stats = {
    total_queries: 0,
    success_rate: 0,
    total_tokens: 0,
    average_execution_time: 0,
    provider_stats: {}
  },
  onFilterChange,
  isLoading = false
}) => {

  const renderContent = () => {
    if (isLoading) {
      return (
        <Tr>
          <Td colSpan={7}>
            <Center py={8}>
              <Spinner />
              <Text ml={3}>Loading logs...</Text>
            </Center>
          </Td>
        </Tr>
      );
    }

    if (!logs.length) {
      return (
        <Tr>
          <Td colSpan={7}>
            <Center py={8}>
              <Text color="gray.500">No logs found. Generate some content to see logs here.</Text>
            </Center>
          </Td>
        </Tr>
      );
    }

    return logs.map((log) => (
      <Tr key={log.id}>
        <Td>#{log.id}</Td>
        <Td maxW="300px" isTruncated>{log.idea}</Td>
        <Td>
          <Badge colorScheme={log.status === 'success' ? 'green' : 'red'}>
            {log.status}
          </Badge>
          {log.error_message && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {log.error_message}
            </Text>
          )}
        </Td>
        <Td>{log.ai_provider}</Td>
        <Td>{log.execution_time.toFixed(2)}s</Td>
        <Td>{log.tokens_used || '-'}</Td>
        <Td>{new Date(log.created_at).toLocaleString()}</Td>
      </Tr>
    ));
  };

  return (
    <Stack spacing={6}>
      <StatGroup>
        <Stat>
          <StatLabel>Total Queries</StatLabel>
          <StatNumber>{stats.total_queries}</StatNumber>
          <StatHelpText>
            <StatArrow type={stats.success_rate >= 80 ? 'increase' : 'decrease'} />
            {stats.success_rate.toFixed(1)}% Success Rate
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Tokens Used</StatLabel>
          <StatNumber>{stats.total_tokens.toLocaleString()}</StatNumber>
          <StatHelpText>Across all providers</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Avg. Execution Time</StatLabel>
          <StatNumber>{stats.average_execution_time.toFixed(2)}s</StatNumber>
        </Stat>
      </StatGroup>

      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">Generation Logs</Heading>
            <HStack spacing={4}>
              <Select
                placeholder="AI Provider"
                onChange={(e) => onFilterChange({ provider: e.target.value })}
              >
                <option value="gemini">Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
              </Select>
              <Select
                placeholder="Status"
                onChange={(e) => onFilterChange({ status: e.target.value })}
              >
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </Select>
              <Input
                placeholder="Search ideas..."
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Idea</Th>
                  <Th>Status</Th>
                  <Th>Provider</Th>
                  <Th>Time</Th>
                  <Th>Tokens</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {renderContent()}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Stack>
  );
};