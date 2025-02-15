import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Button,
  useToast,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { ContentBuilderForm } from '../components/ContentBuilder/ContentBuilderForm';
import { ContentPreview } from '../components/ContentBuilder/ContentPreview';

// Add interface for data
interface ContentBuilderData {
  idea: string;
  aiPlatform: string;
  imageSource: string;
}

interface GeneratedContent {
  title?: string;
  outline: Array<{title: string; content?: string}>;
  content: string;
}

export const ContentBuilderPage: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    title: '',
    outline: [],
    content: '',
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const toast = useToast();

  const handleContentGeneration = async (data: ContentBuilderData) => {
    try {
      const response = await fetch(`${wpPostAI.apiUrl}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpPostAI.nonce,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setGeneratedContent(result);
    } catch (error) {
      toast({
        title: 'Error generating content',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handlePublish = async () => {
    if (!generatedContent.content) {
      return; // Không cần thông báo vì nút đã bị disable
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`${wpPostAI.apiUrl}/publish-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpPostAI.nonce,
        },
        body: JSON.stringify({
          title: generatedContent.title || generatedContent.outline[0]?.title,
          content: generatedContent.content,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Post published successfully',
          description: (
            <span>
              View post: <a href={result.post_url} target="_blank" rel="noopener noreferrer">
                {result.post_url}
              </a>
            </span>
          ),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message || 'Failed to publish post');
      }
    } catch (error) {
      toast({
        title: 'Error publishing post',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const isContentReady = Boolean(generatedContent.content);

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(2, 1fr)" gap={8}>
        <GridItem>
          <ContentBuilderForm onSubmit={handleContentGeneration} />
        </GridItem>
        <GridItem>
          <VStack spacing={4}>
            <ContentPreview
              outline={generatedContent.outline}
              content={generatedContent.content}
            />
            <Tooltip
              label={isContentReady ? '' : 'Generate content first to enable publishing'}
              hasArrow
            >
              <Button
                colorScheme="green"
                size="lg"
                width="full"
                onClick={handlePublish}
                isLoading={isPublishing}
                loadingText="Publishing..."
                isDisabled={!isContentReady}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  _hover: { bg: 'green.500' }
                }}
              >
                Publish to WordPress
              </Button>
            </Tooltip>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};