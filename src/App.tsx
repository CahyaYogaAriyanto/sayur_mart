import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CategoryProvider } from './context/CategoryContext';
import { CartProvider } from './context/CartContext';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminManagement } from './pages/AdminManagement';
import { AdminCategories } from './pages/AdminCategories';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSettings } from './pages/AdminSettings';
import { PageWrapper } from './components/PageWrapper';
import { AnimatePresence } from 'motion/react';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-ink flex flex-col">
      {!isAdminPath && <Navbar />}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<PageWrapper key="home"><Home /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper key="products"><Products /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper key="login"><Login /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper key="about"><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper key="contact"><Contact /></PageWrapper>} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<PageWrapper key="admin-dash"><AdminDashboard /></PageWrapper>} />
                <Route path="/admin/manage" element={<PageWrapper key="admin-manage"><AdminManagement /></PageWrapper>} />
                <Route path="/admin/categories" element={<PageWrapper key="admin-cats"><AdminCategories /></PageWrapper>} />
                <Route path="/admin/users" element={<PageWrapper key="admin-users"><AdminUsers /></PageWrapper>} />
                <Route path="/admin/settings" element={<PageWrapper key="admin-settings"><AdminSettings /></PageWrapper>} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <InventoryProvider>
          <CartProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </CartProvider>
        </InventoryProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
