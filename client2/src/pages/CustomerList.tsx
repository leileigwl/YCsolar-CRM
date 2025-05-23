import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon, PhoneIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

interface Customer {
  id: number;
  name: string;
  contact_type: 'WeChat' | 'WhatsApp';
  contact_info: string;
  country: string;
  notes: string;
  last_contact_time: string | null;
  created_at: string;
  updated_at: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载客户列表
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerAPI.getAllCustomers();
        setCustomers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '加载客户数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // 删除客户
  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个客户吗？此操作不可撤销。')) {
      try {
        await customerAPI.deleteCustomer(id.toString());
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || '删除客户失败');
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">客户管理</h1>
        <Link
          to="/customers/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          添加客户
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <p className="text-gray-500">还没有添加任何客户</p>
          <Link
            to="/customers/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            添加第一个客户
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
                        >
                          {customer.name}
                        </Link>
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
                      <div className="flex space-x-2">
                        <Link
                          to={`/customers/${customer.id}/communications/new`}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="记录联系"
                        >
                          <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/customers/${customer.id}/edit`}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title="编辑"
                        >
                          <PencilIcon className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="删除"
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {customer.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="font-medium">备注:</div>
                      <p className="truncate">{customer.notes}</p>
                    </div>
                  )}
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

export default CustomerList; 