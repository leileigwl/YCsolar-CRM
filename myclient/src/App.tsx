import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// 组件
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// 页面
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerList from './pages/CustomerList';
import Dashboard from './pages/Dashboard';

// 待开发的页面占位符
const CustomerForm = () => <div className="p-4">客户表单（待开发）</div>;
const CustomerDetail = () => <div className="p-4">客户详情（待开发）</div>;
const CommunicationForm = () => <div className="p-4">沟通记录表单（待开发）</div>;
const SearchPage = () => <div className="p-4">搜索页面（待开发）</div>;
const ProfilePage = () => <div className="p-4">个人资料页（待开发）</div>;
const SettingsPage = () => <div className="p-4">设置页面（待开发）</div>;

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
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/customers/:id/communications/new" element={<CommunicationForm />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
