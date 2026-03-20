import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { OficinaProvider } from '../lib/supabase-extended';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <OficinaProvider>
        <RouterProvider router={router} />
        <Toaster />
      </OficinaProvider>
    </ThemeProvider>
  );
}

export default App;