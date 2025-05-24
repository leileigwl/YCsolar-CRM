import React, { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon, SearchIcon, } from '@heroicons/react/outline';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: '主页', href: '/', current: false },
  { name: '回收站', href: '/trash', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, content: '您有一个新客户待处理', time: '5分钟前', read: true },
    { id: 2, content: '系统更新通知：文件上传功能已优化', time: '1小时前', read: true },
    { id: 3, content: '欢迎使用客户管理系统！', time: '1天前', read: true }
  ]);
  
  // 设置当前活动导航项
  const currentNav = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href
  }));
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 将搜索参数添加到当前URL
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-indigo-600">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="text-white font-bold text-xl">客户管理系统</Link>
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {currentNav.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="hidden md:block mr-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-indigo-300" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-md leading-5 bg-indigo-500 text-indigo-100 placeholder-indigo-300 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                        placeholder="搜索客户、沟通记录..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                  
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      <span className="sr-only">查看通知</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700">通知</h3>
                            {unreadCount > 0 && (
                              <button 
                                onClick={markAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                标记所有为已读
                              </button>
                            )}
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                暂无通知
                              </div>
                            ) : (
                              notifications.map(notification => (
                                <div 
                                  key={notification.id} 
                                  className={`px-4 py-3 hover:bg-gray-50 ${
                                    !notification.read ? 'bg-indigo-50' : ''
                                  }`}
                                >
                                  <p className="text-sm text-gray-800">{notification.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="border-t border-gray-200 px-4 py-2">
                            <button 
                              onClick={() => navigate('/notifications')}
                              className="text-xs text-indigo-600 hover:text-indigo-800 w-full text-center"
                            >
                              查看所有通知
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                          {user?.username.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              个人信息
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              退出登录
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {currentNav.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-indigo-300" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-md leading-5 bg-indigo-500 text-indigo-100 placeholder-indigo-300 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                      placeholder="搜索客户、沟通记录..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 