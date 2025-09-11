import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageRouter } from './components/LanguageRouter.tsx'
import './styles/globals.css'
import './i18n/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageRouter />
  </StrictMode>,
)