// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './common/ProtectedRoute';
import { MainLayout } from './layout/MainLayout';
// This import now correctly points to the new file:
import { ErrorBoundary } from './common/ErorrBoundarya'; 
import { LoadingScreen } from './common/LoadingScreen';

// Lazy Loading Pages (Performance Optimization)
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProductFormPage = lazy(() => import('./pages/ProductFormPage').then(module => ({ default: module.ProductFormPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      {/* HashRouter wraps everything so AuthProvider can access navigation context if needed */}
      <HashRouter>
        <AuthProvider>
          <ToastContainer 
            position="bottom-right" 
            autoClose={3000} 
            hideProgressBar 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="dark"
          />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/product/add" element={<ProductFormPage />} />
                  <Route path="/product/edit/:id" element={<ProductFormPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;

// 👇 REMOVE ALL THE CODE BELOW THIS LINE IN YOUR App.tsx FILE
/*
interface State { ... }
class ErrorBoundary extends React.Component<Props, State> { ... }
export default ErrorBoundary;
*/
