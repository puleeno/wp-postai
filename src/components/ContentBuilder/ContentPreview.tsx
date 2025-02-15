import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

interface ContentPreviewProps {
  outline: Array<{
    title: string;
    content?: string;
  }>;
  content: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ outline, content }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Content Preview</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="sm" mb={2}>Outline</Heading>
            <List spacing={2}>
              {outline.map((item, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  {item.title}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Heading size="sm" mb={2}>Generated Content</Heading>
            <Text whiteSpace="pre-wrap">{content}</Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};