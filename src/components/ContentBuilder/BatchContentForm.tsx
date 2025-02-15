import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Switch,
  FormHelperText,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface BatchContentFormProps {
  onSubmit: (data: BatchContentData) => Promise<void>;
}

export interface BatchContentData {
  ideas: string[];
  generateCategories: boolean;
  batchSize: number;
  autoPublish: boolean;
}

export const BatchContentForm: React.FC<BatchContentFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BatchContentData>({
    ideas: [],
    generateCategories: true,
    batchSize: 5,
    autoPublish: true
  });
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ideas.length) {
      toast({
        title: 'Error',
        description: 'Please enter at least one idea',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      toast({
        title: 'Batch generation started',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeasChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ideas = e.target.value.split('\n').filter(idea => idea.trim());
    setFormData(prev => ({ ...prev, ideas }));
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Batch Content Generator</Heading>
      </CardHeader>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Content Ideas (one per line)</FormLabel>
              <Textarea
                placeholder="Enter your content ideas here..."
                size="lg"
                rows={8}
                onChange={handleIdeasChange}
              />
              <FormHelperText>
                Each line will be treated as a separate content idea
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Batch Size</FormLabel>
              <NumberInput
                min={1}
                max={20}
                value={formData.batchSize}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  batchSize: parseInt(value)
                }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                Number of contents to generate simultaneously
              </FormHelperText>
            </FormControl>

            <FormControl>
              <HStack spacing={3}>
                <Switch
                  id="auto-publish"
                  isChecked={formData.autoPublish}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    autoPublish: e.target.checked
                  }))}
                />
                <FormLabel htmlFor="auto-publish" mb="0" flex="1">
                  Auto Publish
                </FormLabel>
              </HStack>
              <FormHelperText mt={2}>
                Automatically publish posts after generation
              </FormHelperText>
            </FormControl>

            <FormControl>
              <HStack spacing={3}>
                <Switch
                  id="generate-categories"
                  isChecked={formData.generateCategories}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    generateCategories: e.target.checked
                  }))}
                />
                <FormLabel htmlFor="generate-categories" mb="0" flex="1">
                  Generate Categories
                </FormLabel>
              </HStack>
              <FormHelperText mt={2}>
                AI will suggest relevant categories for each content
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Starting batch..."
            >
              Start Batch Generation
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};