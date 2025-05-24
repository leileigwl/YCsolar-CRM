import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon, 
  ExclamationCircleIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  FilterIcon,
  SearchIcon
} from '@heroicons/react/outline';
import CustomerCard from '../components/CustomerCard';

interface Customer {
  id: number;
  name: string;
  contact_type: string;
  contact_info: string;
  importance: '普通' | '重要' | '特别重要' | 'Normal' | 'Important' | 'VeryImportant';
  country: string;
  notes: string;
  last_contact_time: string | null;
  created_at: string;
  updated_at: string;
}

interface Communication {
  id: number;
  customer_id: number;
  user_id: number;
  content: string;
  communication_time: string;
  created_at: string;
  user_name?: string;
}

interface CustomerWithCommunications extends Customer {
  communications?: Communication[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [customers, setCustomers] = useState<CustomerWithCommunications[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithCommunications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedImportance, setSelectedImportance] = useState<string>('');
  
  // 从URL获取搜索参数
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q');
    if (query) {
      setSearchTerm(query);
      setIsSearching(true);
    } else {
      setSearchTerm('');
      setIsSearching(false);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getAllCustomers();
        const customerData = response.data;

        const customersWithCommunications = await Promise.all(
          customerData.map(async (customer: Customer) => {
            try {
              const commResponse = await communicationAPI.getCustomerCommunications(customer.id.toString());
              return {
                ...customer,
                communications: commResponse.data
              };
            } catch (err) {
              console.error(`获取客户 ${customer.id} 的沟通记录失败:`, err);
              return {
                ...customer,
                communications: []
              };
            }
          })
        );

        setCustomers(customersWithCommunications);
        
        const uniqueCountries = Array.from(new Set(customersWithCommunications.map((customer: Customer) => customer.country)))
          .filter((country): country is string => country !== null && country !== undefined)
          .sort();
        setCountries(uniqueCountries);
        
        console.log('获取到的所有客户:', customersWithCommunications.map(c => ({
          id: c.id,
          name: c.name,
          importance: c.importance
        })));
      } catch (err: any) {
        setError(err.response?.data?.message || '加载客户数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // 修复后的筛选和排序方法
  useEffect(() => {
    let result = [...customers];
    
    console.log('开始筛选，原始客户数量:', result.length);
    console.log('筛选条件 - 重要程度:', selectedImportance, '国家:', selectedCountry, '搜索词:', searchTerm);
    
    // 重要程度筛选
    if (selectedImportance && selectedImportance !== '') {
      const beforeFilter = result.length;
      result = result.filter(customer => {
        const customerImportance = customer.importance || '';
        const isMatch = matchImportance(customerImportance, selectedImportance);
        console.log(`客户 ${customer.name} 重要程度: "${customerImportance}" -> 匹配 "${selectedImportance}"? ${isMatch}`);
        return isMatch;
      });
      console.log(`重要程度筛选: ${beforeFilter} -> ${result.length}`);
    }
    
    // 国家筛选
    if (selectedCountry && selectedCountry !== '') {
      const beforeFilter = result.length;
      result = result.filter(customer => customer.country === selectedCountry);
      console.log(`国家筛选: ${beforeFilter} -> ${result.length}`);
    }
    
    // 搜索筛选
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      const beforeFilter = result.length;
      result = result.filter(customer => {
        const basicInfoMatch = (
          customer.name.toLowerCase().includes(searchLower) ||
          customer.contact_info.toLowerCase().includes(searchLower) ||
          customer.contact_type.toLowerCase().includes(searchLower) ||
          customer.country.toLowerCase().includes(searchLower) ||
          (customer.notes && customer.notes.toLowerCase().includes(searchLower)) ||
          (customer.last_contact_time && customer.last_contact_time.includes(searchTerm))
        );

        const communicationsMatch = customer.communications?.some(comm => 
          comm.content.toLowerCase().includes(searchLower) ||
          comm.communication_time.includes(searchTerm)
        );

        return basicInfoMatch || communicationsMatch;
      });
      console.log(`搜索筛选: ${beforeFilter} -> ${result.length}`);
    }
    
    // 排序
    result = [...result].sort((a, b) => {
      if (!a.last_contact_time && !b.last_contact_time) return 0;
      if (!a.last_contact_time) return 1;
      if (!b.last_contact_time) return -1;
      const timeA = new Date(a.last_contact_time).getTime();
      const timeB = new Date(b.last_contact_time).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
    
    console.log('最终结果客户数量:', result.length);
    setFilteredCustomers(result);
  }, [customers, selectedImportance, selectedCountry, searchTerm, sortOrder]);

  // 修复后的重要程度匹配函数
  const matchImportance = (customerImportance: string, selectedValue: string): boolean => {
    if (!customerImportance || !selectedValue) return false;
    
    // 标准化字符串：去除空格，转小写
    const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
    const normalizedCustomer = normalize(customerImportance);
    const normalizedSelected = normalize(selectedValue);
    
    // 直接匹配
    if (normalizedCustomer === normalizedSelected) {
      return true;
    }
    
    // 中英文映射匹配
    const importanceMapping: { [key: string]: string[] } = {
      '普通': ['普通', 'normal', '普通客户'],
      '重要': ['重要', 'important', '重要客户'],  
      '特别重要': ['特别重要', 'veryimportant', '特别重要客户']
    };
    
    // 查找客户重要程度对应的所有可能值
    for (const [key, values] of Object.entries(importanceMapping)) {
      const normalizedValues = values.map(normalize);
      if (normalizedValues.includes(normalizedCustomer)) {
        // 检查选中值是否也属于同一类别
        return normalizedValues.includes(normalizedSelected) || normalize(key) === normalizedSelected;
      }
    }
    
    return false;
  };

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // 删除客户 - 简化为直接处理删除逻辑
  const handleDelete = async (id: number) => {
    try {
      console.log('正在删除客户ID:', id);
      
      // 执行删除操作
      await customerAPI.deleteCustomer(id.toString());
      
      // 更新客户列表
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer.id !== id)
      );
      
      // 更新筛选后的客户列表
      setFilteredCustomers(prevFilteredCustomers => 
        prevFilteredCustomers.filter(customer => customer.id !== id)
      );
      
    } catch (err: any) {
      console.error('删除客户失败:', err);
      setError(err.response?.data?.message || '删除客户失败');
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
      {/* 欢迎消息 */}
      {user && (
        <div className="bg-indigo-50 rounded-md p-4 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-indigo-800">
                  欢迎回来，{user.username}
                </h3>
                <p className="text-sm text-indigo-600">
                  {new Date().toLocaleDateString('zh-CN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <Link
              to="/customers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              快速添加
            </Link>
          </div>
        </div>
      )}
      
      {!user && (
        <div className="flex justify-end mb-6">
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            快速添加
          </Link>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        {isSearching && (
          <h1 className="text-2xl font-bold text-gray-900">
            搜索结果: "{searchTerm}"
          </h1>
        )}
      </div>

      {/* 移动端搜索框 */}
      <div className="sm:hidden mb-4">
        <form action="/" className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={searchTerm}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="搜索客户、联系方式、沟通记录..."
          />
        </form>
      </div>

      {/* 筛选和排序工具栏 */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
              >
                <option value="">所有地区</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={selectedImportance}
                onChange={(e) => setSelectedImportance(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
              >
                <option value="">所有客户</option>
                <option value="普通">普通客户</option>
                <option value="重要">重要客户</option>
                <option value="特别重要">特别重要客户</option>
              </select>
            </div>
          </div>

          <button
            onClick={toggleSortOrder}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {sortOrder === 'desc' ? (
              <>
                <SortDescendingIcon className="h-5 w-5 mr-1" />
                最近联系优先
              </>
            ) : (
              <>
                <SortAscendingIcon className="h-5 w-5 mr-1" />
                最早联系优先
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {filteredCustomers.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <p className="text-gray-500 mb-4">
            {customers.length === 0 ? '还没有添加任何客户' : 
             isSearching ? `没有找到与"${searchTerm}"匹配的客户` : '没有符合条件的客户'}
          </p>
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加客户
          </Link>
        </div>
      ) : (
        <div>
          {isSearching && (
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-t-lg mb-4">
              <p className="text-sm text-indigo-700">
                找到 {filteredCustomers.length} 个匹配结果
              </p>
            </div>
          )}
          <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
            <ul className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <li key={customer.id}>
                  <CustomerCard 
                    customer={customer}
                    onDelete={handleDelete}
                    searchTerm={searchTerm}
                    highlightSearchTerm={highlightSearchTerm}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// 高亮显示匹配的文本
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200">{part}</mark> : 
          part
      )}
    </>
  );
};

export default Dashboard;