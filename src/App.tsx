import { ChakraProvider } from '@chakra-ui/react';
import { ContentBuilderPage } from './pages/ContentBuilder';

function App() {
  return (
    <ChakraProvider>
      <ContentBuilderPage />
    </ChakraProvider>
  );
}

export default App;