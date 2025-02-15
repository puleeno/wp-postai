import React, { useState, useEffect } from 'react';
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
  Select,
} from '@chakra-ui/react';

interface BatchContentFormProps {
  onSubmit: (data: BatchContentData) => Promise<void>;
}

interface BatchContentData {
  ideas: string[];
  generateCategories: boolean;
  batchSize: number;
  autoPublish: boolean;
  aiPlatform: string;
}

interface APISettings {
  ai_platforms: {
    [key: string]: {
      api_key: string;
      [key: string]: string;
    };
  };
}

export const BatchContentForm: React.FC<BatchContentFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState<BatchContentData>({
    ideas: [],
    generateCategories: true,
    batchSize: 5,
    autoPublish: true,
    aiPlatform: ''
  });
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/wp-json/wp-postai/v1/settings');
      const data: APISettings = await response.json();

      // Lọc các platform có API key
      const platforms = Object.entries(data.ai_platforms)
        .filter(([_, config]) => config.api_key?.trim())
        .map(([platform]) => platform);

      setAvailablePlatforms(platforms);

      // Set default platform nếu có
      if (platforms.length > 0) {
        setFormData(prev => ({
          ...prev,
          aiPlatform: platforms[0]
        }));
      }
    } catch (error) {
      toast({
        title: 'Error fetching AI platforms',
        status: 'error',
        duration: 3000,
      });
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
              <FormLabel>Ideas (one per line)</FormLabel>
              <Textarea
                name="ideas"
                onChange={handleIdeasChange}
                placeholder="Enter your content ideas..."
                minH="200px"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>AI Platform</FormLabel>
              <Select
                name="aiPlatform"
                value={formData.aiPlatform}
                onChange={handleChange}
                isDisabled={!availablePlatforms.length}
              >
                {!availablePlatforms.length ? (
                  <option value="">No AI platforms configured</option>
                ) : (
                  availablePlatforms.map(platform => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Batch Size</FormLabel>
              <NumberInput
                name="batchSize"
                value={formData.batchSize}
                min={1}
                max={10}
                onChange={(_, value) => handleChange({
                  target: { name: 'batchSize', value }
                } as any)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Generate Categories</FormLabel>
              <Switch
                name="generateCategories"
                isChecked={formData.generateCategories}
                onChange={e => handleChange({
                  target: { name: 'generateCategories', value: e.target.checked }
                } as any)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Auto Publish</FormLabel>
              <Switch
                name="autoPublish"
                isChecked={formData.autoPublish}
                onChange={e => handleChange({
                  target: { name: 'autoPublish', value: e.target.checked }
                } as any)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Starting batch..."
              isDisabled={!formData.aiPlatform || !formData.ideas.length}
            >
              Start Batch Generation
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};