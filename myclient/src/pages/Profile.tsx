import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../utils/api';
import { 
  UserIcon, MailIcon, CalendarIcon, ClockIcon, 
  CheckCircleIcon, XCircleIcon, LockClosedIcon,
  KeyIcon, BadgeCheckIcon, ExclamationIcon, 
   UserCircleIcon, ShieldCheckIcon,
  PencilAltIcon, PencilIcon
} from '@heroicons/react/outline';
import { Tab } from '@headlessui/react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // 个人资料状态
  const [username, setUsername] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // 密码状态
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 标签页状态
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  // 更新个人资料
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setProfileError('用户名不能为空');
      return;
    }

    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      await authAPI.updateProfile({ username });
      setProfileSuccess(true);
      // 显示成功消息3秒后自动清除
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || '更新个人资料失败');
    } finally {
      setProfileLoading(false);
    }
  };

  // 更改密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // 验证密码
    if (!currentPassword) {
      setPasswordError('请输入当前密码');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('请输入新密码');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('新密码长度需至少6个字符');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    
    setPasswordLoading(true);
    setPasswordSuccess(false);
    
    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword
      });
      
      // 成功后清空表单
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordSuccess(true);
      // 显示成功消息3秒后自动清除
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || '密码修改失败');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部个人信息卡片 */}
      <div className="mb-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-indigo-600 font-bold text-4xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-white">{user.username}</h1>
              <p className="text-indigo-100">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>注册于 {formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>上次登录 {formatDate(user.last_login)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 标签页组件 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex p-1 bg-gray-100">
            <Tab 
              className={({ selected }) => `
                w-full py-3 text-sm font-medium rounded-md
                flex items-center justify-center
                ${selected 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <UserCircleIcon className="w-5 h-5 mr-2" />
              个人资料
            </Tab>
            <Tab 
              className={({ selected }) => `
                w-full py-3 text-sm font-medium rounded-md
                flex items-center justify-center
                ${selected 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              安全设置
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            {/* 个人资料面板 */}
            <Tab.Panel>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">编辑个人资料</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500 ml-7">修改您的个人显示信息</p>
              </div>
              
              {/* 消息通知 */}
              {profileSuccess && (
                <div className="m-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <p className="text-sm text-green-700">个人资料更新成功</p>
                </div>
              )}
              
              {profileError && (
                <div className="m-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700">{profileError}</p>
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit} className="px-6 py-5 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
                  <div>
                    <label htmlFor="username" className=" text-sm font-medium text-gray-700 flex items-center">
                      <span>用户昵称</span>
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <PencilIcon className="h-3 w-3 mr-1" />
                        可编辑
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-2 border-indigo-300 rounded-md bg-white"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <PencilAltIcon className="h-5 w-5 text-indigo-500" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      这是您在系统中显示的名称
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label htmlFor="email" className=" text-sm font-medium text-gray-700 flex items-center">
                      <span>电子邮箱</span>
                      <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                        不可编辑
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        disabled
                        className="bg-gray-50 text-gray-500 block w-full pl-10 sm:text-sm border border-gray-200 rounded-md cursor-not-allowed"
                        value={user.email}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      电子邮箱暂不支持修改
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {profileLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        保存中...
                      </>
                    ) : (
                      <>
                        <PencilAltIcon className="-ml-1 mr-2 h-5 w-5" />
                        保存修改
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Tab.Panel>
            
            {/* 安全设置面板 */}
            <Tab.Panel>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">修改密码</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500 ml-7">更改您的账户登录密码</p>
              </div>
              
              {/* 消息通知 */}
              {passwordSuccess && (
                <div className="m-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <p className="text-sm text-green-700">密码修改成功，下次登录请使用新密码</p>
                </div>
              )}
              
              {passwordError && (
                <div className="m-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                  <div className="flex">
                    <ExclamationIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <div className="text-sm text-yellow-700">
                      <p>为了保证账户安全，请设置一个强密码：</p>
                      <ul className="list-disc ml-5 mt-1">
                        <li>至少6个字符</li>
                        <li>建议包含字母、数字和特殊字符</li>
                        <li>避免使用容易被猜到的信息</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center">
                    <PencilAltIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-indigo-700">密码修改区域</span>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="currentPassword" className=" text-sm font-medium text-gray-700 flex items-center">
                      <span>当前密码</span>
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">必填</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-2 border-indigo-300 rounded-md bg-white"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="输入当前密码"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="newPassword" className=" text-sm font-medium text-gray-700 flex items-center">
                      <span>新密码</span>
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">必填</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-2 border-indigo-300 rounded-md bg-white"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="设置新密码"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="confirmPassword" className=" text-sm font-medium text-gray-700 flex items-center">
                      <span>确认新密码</span>
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">必填</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BadgeCheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-2 border-indigo-300 rounded-md bg-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="再次输入新密码"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-5">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        提交中...
                      </>
                    ) : (
                      <>
                        <PencilAltIcon className="-ml-1 mr-2 h-5 w-5" />
                        更改密码
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Profile; 