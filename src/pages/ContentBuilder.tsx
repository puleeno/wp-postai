import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Button,
  useToast,
  VStack,
  Tooltip,
  Select,
  HStack,
  FormControl,
  FormLabel,
  useBreakpointValue,
  Box,
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

// Thêm interfaces
interface PostType {
  value: string;
  label: string;
}

interface PublishOptions {
  postType: string;
  status: 'draft' | 'publish';
}

export const ContentBuilderPage: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    title: '',
    outline: [],
    content: '',
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const toast = useToast();
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    postType: 'post',
    status: 'publish'
  });

  const gridColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)"
  });

  const publishControlsLayout = useBreakpointValue({
    base: "column",
    sm: "row"
  });

  useEffect(() => {
    fetchPostTypes();
  }, []);

  const fetchPostTypes = async () => {
    try {
      const response = await fetch(`${wpPostAI.apiUrl}/post-types`, {
        headers: {
          'X-WP-Nonce': wpPostAI.nonce,
        }
      });
      const data = await response.json();
      setPostTypes(data);
    } catch (error) {
      toast({
        title: 'Error fetching post types',
        status: 'error',
        duration: 3000,
      });
    }
  };

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
    if (!generatedContent.content) return;

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
          post_type: publishOptions.postType,
          post_status: publishOptions.status
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: `${publishOptions.status === 'publish' ? 'Published' : 'Draft saved'} successfully`,
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
    <Container maxW="container.xl" py={4} px={{ base: 4, md: 8 }}>
      <Grid
        templateColumns={gridColumns}
        gap={{ base: 4, md: 8 }}
      >
        <GridItem w="100%">
          <ContentBuilderForm onSubmit={handleContentGeneration} />
        </GridItem>
        <GridItem w="100%">
          <VStack spacing={4} w="100%">
            <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg="white">
              <VStack spacing={4} w="100%">
                <HStack
                  width="full"
                  spacing={4}
                  flexDirection={publishControlsLayout}
                >
                  <FormControl>
                    <FormLabel>Post Type</FormLabel>
                    <Select
                      defaultValue="post"
                      value={publishOptions.postType}
                      onChange={(e) => setPublishOptions(prev => ({
                        ...prev,
                        postType: e.target.value
                      }))}
                    >
                      {postTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue="publish"
                      value={publishOptions.status}
                      onChange={(e) => setPublishOptions(prev => ({
                        ...prev,
                        status: e.target.value as 'draft' | 'publish'
                      }))}
                    >
                      <option value="publish">Publish</option>
                      <option value="draft">Draft</option>
                    </Select>
                  </FormControl>
                </HStack>
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
                    loadingText={`${publishOptions.status === 'publish' ? 'Publishing' : 'Saving draft'}...`}
                    isDisabled={!isContentReady}
                    _disabled={{
                      opacity: 0.6,
                      cursor: 'not-allowed',
                      _hover: { bg: 'green.500' }
                    }}
                  >
                    {publishOptions.status === 'publish' ? 'Publish to WordPress' : 'Save as Draft'}
                  </Button>
                </Tooltip>
              </VStack>
            </Box>
            <ContentPreview
              outline={generatedContent.outline}
              content={generatedContent.content}
            />
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};