import React, { useState } from 'react';
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

interface ApiError {
  message: string;
}

export const ContentBuilderForm: React.FC<ContentBuilderFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ContentBuilderData>({
    idea: '',
    aiPlatform: 'gemini',
    imageSource: 'unsplash',
    generateCategories: true
  });
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      toast({
        title: 'Content generation started',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Error',
        description: apiError.message || 'An unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
              <FormLabel>Your Idea</FormLabel>
              <Textarea
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="Enter your content idea here..."
                size="lg"
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>AI Platform</FormLabel>
              <Select
                name="aiPlatform"
                value={formData.aiPlatform}
                onChange={handleChange}
                defaultValue="gemini"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="grok">Grok</option>
                <option value="meta_ai">Meta AI</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Image Source</FormLabel>
              <Select
                name="imageSource"
                value={formData.imageSource}
                onChange={handleChange}
              >
                <option value="unsplash">Unsplash</option>
                <option value="bing">Bing</option>
                <option value="google">Google</option>
                <option value="serpapi">SerpAPI</option>
              </Select>
            </FormControl>

            <FormControl>
              <HStack spacing={3}>
                <Switch
                  id="generate-categories"
                  name="generateCategories"
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
                AI will suggest relevant categories for your content
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Generating..."
            >
              Generate Content
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};