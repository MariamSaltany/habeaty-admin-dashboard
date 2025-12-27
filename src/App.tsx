// kotobi-admin-dashboard-web/src/App.tsx
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './common/ProtectedRoute';

import { MainLayout } from './layout/MainLayout';
import { ErrorBoundary } from './common/ErrorBoundary'; 
import { LoadingScreen } from './common/LoadingScreen';


const lazyLoad = (path: string, namedExport: string) => 
  lazy(() => import(`./pages/${path}.tsx`).then(m => ({ default: m[namedExport] })));

const LoginPage = lazyLoad('LoginPage', 'LoginPage');
const DashboardPage = lazyLoad('DashboardPage', 'DashboardPage');
const BooksPage = lazyLoad('BooksPage', 'BooksPage');
const CategoriesPage = lazyLoad('CategoriesPage', 'CategoriesPage');
const AuthorsPage = lazyLoad('AuthorsPage', 'AuthorsPage');
const BookFormPage = lazyLoad('BookFormPage', 'BookFormPage');
const BookDetailPage = lazyLoad('BookDetailPage', 'BookDetailPage');
const AuthorFormPage = lazyLoad('AuthorFormPage', 'AuthorFormPage');

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <ToastContainer 
            position="bottom-right" 
            autoClose={3000} 
            theme="dark"
            hideProgressBar
          />
          
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/authors" element={<AuthorsPage />} />
                  <Route path="/author/add" element={<AuthorFormPage />} />
                  <Route path="/author/edit/:id" element={<AuthorFormPage />} />
                  <Route path="/book/add" element={<BookFormPage />} />
                  <Route path="/book/edit/:slug" element={<BookFormPage />} />
                  <Route path="/book/:slug" element={<BookDetailPage />} />
                </Route>
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;