import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LibraryProvider } from './contexts/LibraryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <LibraryProvider>
    <App />
  </LibraryProvider>
)
