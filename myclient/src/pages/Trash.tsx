import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../utils/api';
import { format } from 'date-fns';
import { 
  RefreshIcon,
  TrashIcon,
  ExclamationIcon, 
  ExclamationCircleIcon
} from '@heroicons/react/outline';

interface Customer {
  id: number;
  name: string;
  contact_type: string;
  contact_info: string;
  importance: 'Normal' | 'Important' | 'VeryImportant';
  country: string;
  last_contact_time: string | null;
  created_at: string;
  updated_at: string;
}

const Trash: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeletedCustomers();
  }, []);

  const fetchDeletedCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getDeletedCustomers();
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '加载已删除客户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 恢复客户
  const handleRestore = async (id: number) => {
    try {
      await customerAPI.restoreCustomer(id.toString());
      // 恢复后从列表中移除
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || '恢复客户失败');
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '未记录';
    try {
      return format(new Date(dateTime), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return '日期格式错误';
    }
  };

  // 重要程度标记
  const ImportanceIndicator: React.FC<{ importance: Customer['importance'] }> = ({ importance }) => {
    if (importance === 'Normal') return null;
    
    if (importance === 'Important') {
      return (
        <span className="flex items-center mr-2 text-yellow-600" title="重要">
          <ExclamationIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
    }
    
    return (
      <span className="flex items-center mr-2 text-red-600" title="非常重要">
        <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
      </span>
    );
  };

  // 根据重要程度获取背景色类名
  const getImportanceClass = (importance: string) => {
    switch (importance) {
      case 'VeryImportant':
        return 'bg-red-50';
      case 'Important':
        return 'bg-yellow-50';
      default:
        return '';
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">回收站</h1>
        <button
          onClick={fetchDeletedCustomers}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          刷新
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <TrashIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
            <p className="text-gray-500 mt-4">回收站中没有客户记录</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              返回首页
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id} className={getImportanceClass(customer.importance)}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <ImportanceIndicator importance={customer.importance} />
                          <span className="text-lg font-medium text-gray-600">
                            {customer.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="mr-2">{customer.contact_type}:</span>
                          <span>{customer.contact_info}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6 text-right text-sm text-gray-500">
                        <div>上次联系时间</div>
                        <div className="font-medium">
                          {formatDateTime(customer.last_contact_time)}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleRestore(customer.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          恢复
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">国家/地区: {customer.country}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Trash; 