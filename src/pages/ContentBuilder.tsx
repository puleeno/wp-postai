import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react';
import { ContentBuilderForm } from '../components/ContentBuilder/ContentBuilderForm';
import { ContentPreview } from '../components/ContentBuilder/ContentPreview';

export const ContentBuilderPage: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState({
    outline: [],
    content: '',
  });

  const handleContentGeneration = async (data) => {
    // Implement API call to WordPress backend here
    // This should communicate with your ContentBuilder PHP class
    const response = await fetch('/wp-json/wp-postai/v1/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setGeneratedContent(result);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(2, 1fr)" gap={8}>
        <GridItem>
          <ContentBuilderForm onSubmit={handleContentGeneration} />
        </GridItem>
        <GridItem>
          <ContentPreview
            outline={generatedContent.outline}
            content={generatedContent.content}
          />
        </GridItem>
      </Grid>
    </Container>
  );
};