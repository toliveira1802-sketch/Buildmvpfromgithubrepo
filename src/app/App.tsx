import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
