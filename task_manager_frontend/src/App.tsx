/**
 * COMPOSANT RACINE : les routes de l'application
 *
 * Hiérarchie des composants (de l'extérieur vers l'intérieur) :
 *
 *   BrowserRouter      -> active la navigation sans rechargement de page
 *     AuthProvider     -> met le token/login à disposition de tous
 *       Routes         -> choisit la page selon l'URL
 *         /login       -> LoginPage
 *         /register    -> RegisterPage
 *         /tasks       -> TasksPage (protégée par ProtectedRoute)
 *         *            -> redirection vers /tasks
 *
 * Équivalent Angular : app.routes.ts + RouterModule, mais écrit en JSX.
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Page protégée : sans token, ProtectedRoute redirige vers /login. */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          {/* Toute URL inconnue renvoie vers /tasks. */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
