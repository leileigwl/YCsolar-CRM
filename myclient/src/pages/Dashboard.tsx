import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { 
  PlusIcon, 
  SortAscendingIcon,
  SortDescendingIcon,
  SearchIcon,
  DocumentReportIcon,
  ClockIcon
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
  communication_count: number;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [customers, setCustomers] = useState<CustomerWithCommunications[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithCommunications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'last_contact_time' | 'communication_count'>('last_contact_time');
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
              const communications = commResponse.data;
              return {
                ...customer,
                communications: communications,
                communication_count: communications.length
              };
            } catch (err) {
              console.error(`获取客户 ${customer.id} 的沟通记录失败:`, err);
              return {
                ...customer,
                communications: [],
                communication_count: 0
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
          importance: c.importance,
          communication_count: c.communication_count
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
      if (sortField === 'communication_count') {
        // 按沟通次数排序
        const countA = a.communication_count || 0;
        const countB = b.communication_count || 0;
        return sortOrder === 'desc' ? countB - countA : countA - countB;
      } else {
        // 按最后联系时间排序
        if (!a.last_contact_time && !b.last_contact_time) return 0;
        if (!a.last_contact_time) return 1;
        if (!b.last_contact_time) return -1;
        const timeA = new Date(a.last_contact_time).getTime();
        const timeB = new Date(b.last_contact_time).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });
    
    console.log('最终结果客户数量:', result.length);
    setFilteredCustomers(result);
  }, [customers, selectedImportance, selectedCountry, searchTerm, sortOrder, sortField]);

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
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleSortField = () => {
    setSortField(sortField === 'last_contact_time' ? 'communication_count' : 'last_contact_time');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">客户列表</h1>
          <p className="mt-1 text-sm text-gray-600">
            {!isSearching
              ? `共 ${filteredCustomers.length} 位客户`
              : `找到 ${filteredCustomers.length} 条搜索结果`}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            添加客户
          </Link>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
          {/* 国家筛选 */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700">
              国家:
            </label>
            <div className="relative">
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%235a67d8%22%20d%3D%22M9.293%2012.95l.707.707L15.657%208l-1.414-1.414L10%2010.828%205.757%206.586%204.343%208z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", paddingRight: "2.5rem" }}
              >
                <option value="">所有国家</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          
            {/* 重要程度筛选 */}
            <label htmlFor="importance-filter" className="block text-sm font-medium text-gray-700 mt-4 sm:mt-0  border-gray-300 rounded-md">
              重要程度:
            </label>
            <div className="relative">
              <select
                id="importance-filter"
                value={selectedImportance}
                onChange={(e) => setSelectedImportance(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%235a67d8%22%20d%3D%22M9.293%2012.95l.707.707L15.657%208l-1.414-1.414L10%2010.828%205.757%206.586%204.343%208z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", paddingRight: "2.5rem" }}
              >
                <option value="">所有重要程度</option>
                <option value="普通">普通客户</option>
                <option value="重要">重要客户</option>
                <option value="特别重要">特别重要客户</option>
              </select>
            </div>
          </div>

          {/* 排序和搜索 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button
                onClick={toggleSortField}
                className="px-3 py-2 flex items-center text-sm font-medium rounded-md text-gray-600 hover:text-gray-900"
                title={sortField === 'last_contact_time' ? "按最后联系时间排序" : "按沟通次数排序"}
              >
                {sortField === 'last_contact_time' ? (
                  <>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    联系时间
                  </>
                ) : (
                  <>
                    <DocumentReportIcon className="h-4 w-4 mr-1" />
                    沟通次数
                  </>
                )}
              </button>
              <button
                onClick={toggleSortOrder}
                className="ml-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700"
                title={sortOrder === 'desc' ? "降序排列" : "升序排列"}
              >
                {sortOrder === 'desc' ? (
                  <SortDescendingIcon className="h-5 w-5" />
                ) : (
                  <SortAscendingIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <form
              className="w-full sm:w-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const searchParams = new URLSearchParams(location.search);
                if (searchTerm) {
                  searchParams.set('q', searchTerm);
                } else {
                  searchParams.delete('q');
                }
                window.history.pushState({}, '', `?${searchParams.toString()}`);
                setIsSearching(!!searchTerm);
              }}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="搜索客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>
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