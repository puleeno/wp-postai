import React from 'react';
import {
  Container,
  Heading,
  Box,
} from '@chakra-ui/react';
import { APISettingsForm } from '../components/Settings/APISettingsForm';

export const SettingsPage: React.FC = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Heading size="lg">Settings</Heading>
      </Box>
      <APISettingsForm />
    </Container>
  );
};