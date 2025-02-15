import React from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react';

interface ContentPreviewProps {
  outline: Array<{title: string; content?: string}>;
  content: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ outline, content }) => {
  return (
    <Box
      w="100%"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      minH="500px"
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch" w="100%">
        {outline.length > 0 && (
          <>
            <Box>
              <Heading size="md" mb={4}>Outline</Heading>
              <VStack align="stretch" spacing={2}>
                {outline.map((section, index) => (
                  <Text key={index}>
                    {index + 1}. {section.title}
                  </Text>
                ))}
              </VStack>
            </Box>
            <Divider />
          </>
        )}

        {content && (
          <Box>
            <Heading size="md" mb={4}>Generated Content</Heading>
            <Box
              dangerouslySetInnerHTML={{ __html: content }}
              sx={{
                'h1, h2, h3, h4, h5, h6': {
                  marginTop: '1em',
                  marginBottom: '0.5em',
                  fontWeight: 'bold'
                },
                'p': {
                  marginBottom: '1em'
                },
                'ul, ol': {
                  marginLeft: '1.5em',
                  marginBottom: '1em'
                },
                'li': {
                  marginBottom: '0.5em'
                },
                'img': {
                  maxWidth: '100%',
                  height: 'auto',
                  marginBottom: '1em'
                }
              }}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};