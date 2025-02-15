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
} from '@chakra-ui/react';

interface ContentBuilderFormProps {
  onSubmit: (data: ContentBuilderData) => Promise<void>;
}

interface ContentBuilderData {
  idea: string;
  aiPlatform: string;
  imageSource: string;
}

interface ApiError {
  message: string;
}

export const ContentBuilderForm: React.FC<ContentBuilderFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data: ContentBuilderData = {
        idea: formData.get('idea') as string,
        aiPlatform: formData.get('aiPlatform') as string,
        imageSource: formData.get('imageSource') as string,
      };

      await onSubmit(data);
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

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Generate Content</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Content Idea</FormLabel>
              <Textarea
                name="idea"
                placeholder="Enter your content idea or topic"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>AI Platform</FormLabel>
              <Select name="aiPlatform">
                <option value="chatgpt">ChatGPT</option>
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
                <option value="copilot">Copilot</option>
                <option value="grok">Grok</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Image Source</FormLabel>
              <Select name="imageSource">
                <option value="unsplash">Unsplash</option>
                <option value="bing">Bing Images</option>
                <option value="google">Google Images</option>
                <option value="serpapi">SerpAPI</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Generating..."
              width="full"
            >
              Generate Content
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};