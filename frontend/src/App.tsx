import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageDelivery from './pages/admin/ManageDelivery';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageInventory from './pages/admin/ManageInventory';
import ManageSettings from './pages/admin/ManageSettings';
import ManageReceipts from './pages/admin/ManageReceipts';
import ManagePayments from './pages/admin/ManagePayments';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageNotifications from './pages/admin/ManageNotifications';
import MockCheckout from './pages/customer/MockCheckout';
import DigitalReceipt from './pages/customer/DigitalReceipt';
import ContactUs from './pages/customer/ContactUs';
import './index.css'; // Global styling

import CustomerDashboard from './pages/customer/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout-test" element={<MockCheckout />} />
          <Route path="/receipt/:reference" element={<DigitalReceipt />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="inventory" element={<ManageInventory />} />
            <Route path="customers" element={<ManageCustomers />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="receipts" element={<ManageReceipts />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="notifications" element={<ManageNotifications />} />
            <Route path="delivery" element={<ManageDelivery />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
