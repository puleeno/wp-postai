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
  Link,
  Progress,
  HStack,
  Center,
} from '@chakra-ui/react';

interface BatchItem {
  id: number;
  total_items: number;
  completed_items: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

interface BatchListProps {
  batches?: BatchItem[];
  isLoading?: boolean;
}

export const BatchList: React.FC<BatchListProps> = ({ batches = [], isLoading = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Tr>
          <Td colSpan={6}>
            <Center py={4}>
              <Text>Loading batches...</Text>
            </Center>
          </Td>
        </Tr>
      );
    }

    if (!batches.length) {
      return (
        <Tr>
          <Td colSpan={6}>
            <Center py={4}>
              <Text color="gray.500">No batch generations found. Create your first batch above!</Text>
            </Center>
          </Td>
        </Tr>
      );
    }

    return batches.map((batch) => (
      <Tr key={batch.id}>
        <Td>#{batch.id}</Td>
        <Td>
          <HStack spacing={2}>
            <Progress
              value={(batch.completed_items / batch.total_items) * 100}
              size="sm"
              width="150px"
              colorScheme={getStatusColor(batch.status)}
            />
            <Text fontSize="sm">
              {batch.completed_items}/{batch.total_items}
            </Text>
          </HStack>
        </Td>
        <Td>
          <Badge colorScheme={getStatusColor(batch.status)}>
            {batch.status}
          </Badge>
        </Td>
        <Td>{new Date(batch.created_at).toLocaleString()}</Td>
        <Td>
          {batch.completed_at ?
            new Date(batch.completed_at).toLocaleString() :
            '-'
          }
        </Td>
        <Td>
          <Link color="blue.500" href={`#/batch/${batch.id}`}>
            View Details
          </Link>
        </Td>
      </Tr>
    ));
  };

  return (
    <Card mt={6}>
      <CardHeader>
        <Heading size="md">Recent Batches</Heading>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Progress</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Completed</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderContent()}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
};