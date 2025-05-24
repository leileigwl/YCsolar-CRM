import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// 组件
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// 页面
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerForm from './pages/CustomerForm';
import CustomerDetail from './pages/CustomerDetail';
import CommunicationForm from './pages/CommunicationForm';
import CommunicationEdit from './pages/CommunicationEdit';
import Profile from './pages/Profile';
import Trash from './pages/Trash';

// 待开发的页面占位符
const NotificationsPage = () => (
  <div className="p-4 bg-white shadow overflow-hidden sm:rounded-lg">
    <h1 className="text-xl font-semibold mb-4">通知中心</h1>
    <p className="text-gray-500">暂无更多通知</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 私有路由 */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/customers/:id/communications/new" element={<CommunicationForm />} />
              <Route path="/customers/:id/communications/:communicationId/edit" element={<CommunicationEdit />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/trash" element={<Trash />} />
            </Route>
          </Route>
          
          {/* 重定向其他路径到主页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
