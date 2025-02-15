import React, { useState, useEffect } from 'react';
import { Container, useToast, VStack } from '@chakra-ui/react';
import { BatchContentForm, BatchContentData } from '../components/ContentBuilder/BatchContentForm';
import { BatchList } from '../components/ContentBuilder/BatchList';

interface BatchItem {
  id: number;
  total_items: number;
  completed_items: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export const BatchContentPage: React.FC = () => {
  const toast = useToast();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${wpPostAI.apiUrl}/batches`, {
        headers: {
          'X-WP-Nonce': wpPostAI.nonce,
        }
      });
      const data = await response.json();
      setBatches(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching batches',
        status: 'error',
        duration: 3000,
      });
      setBatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchSubmit = async (data: BatchContentData) => {
    try {
      const response = await fetch(`${wpPostAI.apiUrl}/generate-batch-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpPostAI.nonce,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to start batch generation');
      }

      await fetchBatches(); // Refresh list after new batch

      toast({
        title: 'Batch generation started',
        description: `Processing ${data.ideas.length} content items`,
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Error starting batch generation',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <BatchContentForm onSubmit={handleBatchSubmit} />
        <BatchList batches={batches} isLoading={isLoading} />
      </VStack>
    </Container>
  );
};