import React from 'react';
import {
  VStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';

interface APISettings {
  ai_platforms: {
    openai: {
      api_key: string;
      organization_id?: string;
    };
    gemini: {
      api_key: string;
    };
    claude: {
      api_key: string;
    };
    grok: {
      api_key: string;
    };
    meta_ai: {
      api_key: string;
      app_secret: string;
    };
  };
  image_sources: {
    unsplash: {
      access_key: string;
      secret_key: string;
    };
    bing: {
      api_key: string;
    };
    google: {
      api_key: string;
      cx_id: string;
    };
    serpapi: {
      api_key: string;
    };
  };
}

// Add type for error
interface ApiError {
    message: string;
}

const defaultSettings: APISettings = {
  ai_platforms: {
    openai: {
      api_key: '',
      organization_id: ''
    },
    gemini: {
      api_key: ''
    },
    claude: {
      api_key: ''
    },
    grok: {
      api_key: ''
    },
    meta_ai: {
      api_key: '',
      app_secret: ''
    }
  },
  image_sources: {
    unsplash: {
      access_key: '',
      secret_key: ''
    },
    bing: {
      api_key: ''
    },
    google: {
      api_key: '',
      cx_id: ''
    },
    serpapi: {
      api_key: ''
    }
  }
};

export const APISettingsForm: React.FC = () => {
  const [settings, setSettings] = React.useState<APISettings>(defaultSettings);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/wp-json/wp-postai/v1/settings');
      const data = await response.json();
      // Merge received data with default settings to ensure all fields exist
      setSettings({
        ...defaultSettings,
        ...data,
        ai_platforms: {
          ...defaultSettings.ai_platforms,
          ...(data.ai_platforms || {})
        },
        image_sources: {
          ...defaultSettings.image_sources,
          ...(data.image_sources || {})
        }
      });
    } catch (error) {
      toast({
        title: 'Error fetching settings',
        status: 'error',
        duration: 3000,
      });
      // Set default settings on error
      setSettings(defaultSettings);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/wp-json/wp-postai/v1/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpPostAI.nonce, // Use wpPostAI instead of wpApiSettings
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: 'Settings saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: 'Error saving settings',
        description: apiError.message || 'An unknown error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6}>
        <Card width="100%">
          <CardHeader>
            <Heading size="md">API Settings</Heading>
          </CardHeader>
          <CardBody>
            <Accordion allowMultiple>
              {/* AI Platforms Section */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      AI Platforms
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <VStack spacing={4}>
                    {/* OpenAI */}
                    <FormControl>
                      <FormLabel>OpenAI API Key</FormLabel>
                      <Input
                        type="password"
                        value={settings.ai_platforms.openai.api_key}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai_platforms: {
                            ...settings.ai_platforms,
                            openai: {
                              ...settings.ai_platforms.openai,
                              api_key: e.target.value,
                            },
                          },
                        })}
                      />
                    </FormControl>

                    {/* Gemini */}
                    <FormControl>
                      <FormLabel>Gemini API Key</FormLabel>
                      <Input
                        type="password"
                        value={settings.ai_platforms.gemini.api_key}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai_platforms: {
                            ...settings.ai_platforms,
                            gemini: {
                              api_key: e.target.value,
                            },
                          },
                        })}
                      />
                    </FormControl>

                    {/* Add other AI platform fields similarly */}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              {/* Image Sources Section */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Image Sources
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <VStack spacing={4}>
                    {/* Unsplash */}
                    <FormControl>
                      <FormLabel>Unsplash Access Key</FormLabel>
                      <Input
                        type="password"
                        value={settings.image_sources.unsplash.access_key}
                        onChange={(e) => setSettings({
                          ...settings,
                          image_sources: {
                            ...settings.image_sources,
                            unsplash: {
                              ...settings.image_sources.unsplash,
                              access_key: e.target.value,
                            },
                          },
                        })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Unsplash Secret Key</FormLabel>
                      <Input
                        type="password"
                        value={settings.image_sources.unsplash.secret_key}
                        onChange={(e) => setSettings({
                          ...settings,
                          image_sources: {
                            ...settings.image_sources,
                            unsplash: {
                              ...settings.image_sources.unsplash,
                              secret_key: e.target.value,
                            },
                          },
                        })}
                      />
                    </FormControl>

                    {/* Add other image source fields similarly */}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          width="200px"
        >
          Save Settings
        </Button>
      </VStack>
    </form>
  );
};