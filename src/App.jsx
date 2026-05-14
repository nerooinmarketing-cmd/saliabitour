import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ScrollToTop from './components/common/ScrollToTop'

// Public Pages
import HomePage from './pages/public/HomePage'
import ToursPage from './pages/public/ToursPage'
import TourDetailPage from './pages/public/TourDetailPage'
import HotelsPage from './pages/public/HotelsPage'
import HotelDetailPage from './pages/public/HotelDetailPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import BlogPage from './pages/public/BlogPage'
import CheckoutPage from './pages/public/CheckoutPage'
import PublicLoginPage from './pages/public/LoginPage'

// Admin Pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import TourListPage from './pages/admin/tours/TourListPage'
import TourFormPage from './pages/admin/tours/TourFormPage'
import HotelListPage from './pages/admin/hotels/HotelListPage'
import HotelFormPage from './pages/admin/hotels/HotelFormPage'
import ReservationListPage from './pages/admin/reservations/ReservationListPage'
import ReservationDetailPage from './pages/admin/reservations/ReservationDetailPage'
import CustomerListPage from './pages/admin/customers/CustomerListPage'
import CustomerDetailPage from './pages/admin/customers/CustomerDetailPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import ContentPage from './pages/admin/ContentPage'
import MediaPage from './pages/admin/MediaPage'
import SettingsPage from './pages/admin/SettingsPage'

import MigrationPage from './pages/admin/MigrationPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // if (isLoading) return <div>Yükleniyor...</div>; // Optional loading state

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="tours/:slug" element={<TourDetailPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="hotels/:slug" element={<HotelDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<PublicLoginPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="tours" element={<TourListPage />} />
        <Route path="tours/new" element={<TourFormPage />} />
        <Route path="tours/:id/edit" element={<TourFormPage />} />
        <Route path="hotels" element={<HotelListPage />} />
        <Route path="hotels/new" element={<HotelFormPage />} />
        <Route path="hotels/:id/edit" element={<HotelFormPage />} />
        <Route path="reservations" element={<ReservationListPage />} />
        <Route path="reservations/:id" element={<ReservationDetailPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="migration" element={<MigrationPage />} />
      </Route>
    </Routes>
    </>
  );
}
