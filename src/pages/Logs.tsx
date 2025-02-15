import React, { useState, useEffect } from 'react';
import { Container, useToast } from '@chakra-ui/react';
import { LogsTable } from '../components/Logs/LogsTable';

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total_queries: 0,
    success_rate: 0,
    total_tokens: 0,
    average_execution_time: 0,
    provider_stats: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams(filters as any).toString();
      const response = await fetch(`${wpPostAI.apiUrl}/logs?${queryParams}`, {
        headers: {
          'X-WP-Nonce': wpPostAI.nonce,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.logs || []);
      setStats(data.stats || {
        total_queries: 0,
        success_rate: 0,
        total_tokens: 0,
        average_execution_time: 0,
        provider_stats: {}
      });
    } catch (error) {
      toast({
        title: 'Error fetching logs',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
      });
      setLogs([]);
      setStats({
        total_queries: 0,
        success_rate: 0,
        total_tokens: 0,
        average_execution_time: 0,
        provider_stats: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <div>Logs</div>
      <LogsTable
        logs={logs}
        stats={stats}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />
    </Container>
  );
};