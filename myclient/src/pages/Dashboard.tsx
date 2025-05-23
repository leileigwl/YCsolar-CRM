import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ChevronRightIcon } from '@heroicons/react/outline';

interface Customer {
  id: number;
  name: string;
  last_contact_time: string | null;
}

interface Communication {
  id: number;
  customer_id: number;
  content: string;
  communication_time: string;
  customer_name: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [recentCommunications, setRecentCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取客户列表并按最后联系时间排序
        const customerResponse = await customerAPI.getAllCustomers();
        const sortedCustomers = customerResponse.data
          .sort((a: Customer, b: Customer) => {
            if (!a.last_contact_time) return 1;
            if (!b.last_contact_time) return -1;
            return new Date(b.last_contact_time).getTime() - new Date(a.last_contact_time).getTime();
          })
          .slice(0, 5); // 只取前5条
        
        setRecentCustomers(sortedCustomers);
        
        // 获取最近沟通记录
        // 注意：这里使用一个模拟实现，因为我们没有直接获取所有沟通记录的API
        // 实际项目中应该添加一个专门的API端点
        const searchResponse = await communicationAPI.searchCommunications('');
        const sortedCommunications = searchResponse.data
          .sort((a: Communication, b: Communication) => 
            new Date(b.communication_time).getTime() - new Date(a.communication_time).getTime()
          )
          .slice(0, 5);
        
        setRecentCommunications(sortedCommunications);
      } catch (err: any) {
        setError(err.response?.data?.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 格式化日期时间
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '未记录';
    try {
      return format(new Date(dateTime), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return '日期格式错误';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          欢迎回来，{user?.username}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          这是您的客户管理系统仪表盘，您可以在这里管理客户和沟通记录。
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 最近联系的客户 */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">最近联系的客户</h2>
            <Link
              to="/customers"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              查看全部
            </Link>
          </div>

          {recentCustomers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">还没有客户记录</p>
              <Link
                to="/customers/new"
                className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                添加第一个客户
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="py-3">
                  <Link
                    to={`/customers/${customer.id}`}
                    className="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          上次联系: {formatDateTime(customer.last_contact_time)}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 最近的沟通记录 */}
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">最近的沟通记录</h2>
            <Link
              to="/search"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              查看全部
            </Link>
          </div>

          {recentCommunications.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">还没有沟通记录</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentCommunications.map((comm) => (
                <li key={comm.id} className="py-3">
                  <Link
                    to={`/customers/${comm.customer_id}`}
                    className="block hover:bg-gray-50 px-2 py-1 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{comm.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(comm.communication_time)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 truncate">
                      {comm.content}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="mt-6 bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/customers/new"
            className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
          >
            <h3 className="text-base font-medium text-indigo-700">添加新客户</h3>
            <p className="mt-1 text-sm text-gray-500">
              添加新的客户信息到系统中
            </p>
          </Link>
          
          <Link
            to="/search"
            className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
          >
            <h3 className="text-base font-medium text-indigo-700">搜索记录</h3>
            <p className="mt-1 text-sm text-gray-500">
              搜索客户或沟通记录
            </p>
          </Link>
          
          <Link
            to="/customers"
            className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
          >
            <h3 className="text-base font-medium text-indigo-700">管理客户</h3>
            <p className="mt-1 text-sm text-gray-500">
              查看和管理所有客户记录
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 