import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PropertyDetails from './pages/PropertyDetails';
import Properties from './pages/Properties';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/Properties';
import EditProperty from './pages/admin/EditProperty';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/:id/edit" element={<EditProperty />} />
      </Route>
    </Routes>
  );
} 
