/**
 * POINT D'ENTRÉE DE L'APPLICATION
 *
 * Ce fichier branche React sur la page HTML : il trouve la <div id="root">
 * de index.html et y affiche le composant <App />.
 *
 * Équivalent Angular : platformBrowserDynamic().bootstrapModule(AppModule).
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Le "!" après getElementById indique à TypeScript que l'élément existe
// forcément (il est présent dans index.html).
createRoot(document.getElementById('root')!).render(
  // StrictMode : en développement uniquement, React exécute deux fois
  // certains traitements pour détecter les effets mal nettoyés.
  // C'est normal de voir deux appels API au premier chargement.
  <StrictMode>
    <App />
  </StrictMode>,
)
