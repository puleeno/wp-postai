import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Switch,
  FormHelperText,
  HStack,
} from '@chakra-ui/react';

interface ContentBuilderFormProps {
  onSubmit: (data: ContentBuilderData) => Promise<void>;
}

interface ContentBuilderData {
  idea: string;
  aiPlatform: string;
  imageSource: string;
  generateCategories: boolean;
}

interface APISettings {
  ai_platforms: {
    [key: string]: {
      api_key: string;
      [key: string]: string;
    };
  };
  image_sources: {
    [key: string]: {
      access_key?: string;
      api_key?: string;
      [key: string]: string | undefined;
    };
  };
}

export const ContentBuilderForm: React.FC<ContentBuilderFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [availableImageSources, setAvailableImageSources] = useState<string[]>([]);
  const [formData, setFormData] = useState<ContentBuilderData>({
    idea: '',
    aiPlatform: '',
    imageSource: '',
    generateCategories: true
  });
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/wp-json/wp-postai/v1/settings');
      const data: APISettings = await response.json();

      // Lọc AI platforms có API key
      const platforms = Object.entries(data.ai_platforms)
        .filter(([_, config]) => config.api_key?.trim())
        .map(([platform]) => platform);

      // Lọc image sources có key
      const imageSources = Object.entries(data.image_sources)
        .filter(([_, config]) => {
          return config.access_key?.trim() || config.api_key?.trim();
        })
        .map(([source]) => source);

      setAvailablePlatforms(platforms);
      setAvailableImageSources(imageSources);

      // Set default values nếu có
      setFormData(prev => ({
        ...prev,
        aiPlatform: platforms[0] || '',
        imageSource: imageSources[0] || ''
      }));
    } catch (error) {
      toast({
        title: 'Error fetching settings',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idea.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an idea',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Generate Content</Heading>
      </CardHeader>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Content Idea</FormLabel>
              <Textarea
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="Enter your content idea here..."
                size="lg"
                rows={4}
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

            <FormControl isRequired>
              <FormLabel>Image Source</FormLabel>
              <Select
                name="imageSource"
                value={formData.imageSource}
                onChange={handleChange}
                isDisabled={!availableImageSources.length}
              >
                {!availableImageSources.length ? (
                  <option value="">No image sources configured</option>
                ) : (
                  availableImageSources.map(source => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))
                )}
              </Select>
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

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Generating..."
              isDisabled={!formData.aiPlatform || !formData.imageSource || !formData.idea.trim()}
            >
              Generate Content
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};