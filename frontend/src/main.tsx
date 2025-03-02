import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ComponentProvider } from './Components/Main/Context.tsx'

createRoot(document.getElementById('root')!).render(
  <ComponentProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ComponentProvider>
)
