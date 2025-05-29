import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  PhoneIcon, 
  PencilIcon, 
  TrashIcon, 
  ExclamationIcon, 
  ExclamationCircleIcon,
  GlobeAltIcon,
  ClockIcon,
  ChatIcon,
  DocumentReportIcon,
} from '@heroicons/react/outline';
import ConfirmDialog from './ConfirmDialog';

interface Customer {
  id: number;
  name: string;
  contact_type: string;
  contact_info: string;
  importance: '普通' | '重要' | '特别重要' | 'Normal' | 'Important' | 'VeryImportant';
  country: string;
  notes: string;
  last_contact_time: string | null;
  communication_count?: number;
  created_at: string;
  updated_at: string;
}

interface CustomerCardProps {
  customer: Customer;
  onDelete: (id: number) => void;
  searchTerm?: string;
  highlightSearchTerm?: (text: string, searchTerm: string) => React.ReactNode;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ 
  customer, 
  onDelete, 
  searchTerm = '',
  highlightSearchTerm = (text) => text  
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // 格式化日期时间
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '未记录';
    try {
      return format(new Date(dateTime), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return '日期格式错误';
    }
  };

  // 重要程度标记和类名
  const getImportanceDetails = (importance: string) => {
    switch (importance) {
      case '特别重要':
      case 'VeryImportant':
        return {
          label: '特别重要客户',
          icon: <ExclamationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />,
          colorClass: 'text-red-600',
          bgClass: 'bg-red-50',
          borderClass: 'border-l-4 border-red-400',
          dotClass: 'bg-red-500'
        };
      case '重要':
      case 'Important':
        return {
          label: '重要客户',
          icon: <ExclamationIcon className="h-5 w-5 mr-1" aria-hidden="true" />,
          colorClass: 'text-yellow-600',
          bgClass: 'bg-yellow-50',
          borderClass: 'border-l-4 border-yellow-400',
          dotClass: 'bg-yellow-500'
        };
      case '普通':
      case 'Normal':
      default:
        return {
          label: '普通客户',
          icon: <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1"></span>,
          colorClass: 'text-gray-500',
          bgClass: '',
          borderClass: 'border-l-4 border-gray-200',
          dotClass: 'bg-gray-400'
        };
    }
  };

  const importanceDetails = getImportanceDetails(customer.importance);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(customer.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className={`transition-all duration-200 hover:bg-gray-50 ${importanceDetails.borderClass} group`}>
      <div className="px-4 py-2.5 flex items-center justify-between w-full">
        {/* 用户信息与基本详情 - 左侧 */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <Link to={`/customers/${customer.id}`}>
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-base">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
          </div>
          
          {/* 姓名和重要程度 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <Link to={`/customers/${customer.id}`} className="text-base font-medium text-indigo-700 hover:text-indigo-900 transition-colors truncate">
                {customer.name}
              </Link>
              <div className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${importanceDetails.colorClass} ${importanceDetails.bgClass}`}>
                {importanceDetails.icon}
                <span className="truncate">{importanceDetails.label}</span>
              </div>
              
              {/* 添加沟通次数标签 */}
              {(customer.communication_count !== undefined && customer.communication_count > 0) && (
                <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-indigo-600 bg-indigo-50">
                  <DocumentReportIcon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                  <span>沟通 {customer.communication_count} 次</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <PhoneIcon className="h-3.5 w-3.5 text-gray-500 mr-1 flex-shrink-0" />
              <span className="font-medium">{customer.contact_type}</span>
              
              <GlobeAltIcon className="h-3.5 w-3.5 text-gray-500 mr-1 ml-3 flex-shrink-0" />
              <span className="truncate">{customer.country}</span>
              
              {customer.notes && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="truncate text-gray-500 italic">
                    {searchTerm && typeof highlightSearchTerm === 'function' 
                      ? highlightSearchTerm(customer.notes, searchTerm) 
                      : customer.notes}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* 右侧信息 - 联系时间和操作按钮 */}
        <div className="flex items-center ml-4">
          {/* 联系时间 */}
          <div className="text-right text-xs mr-4">
            <div className="flex items-center text-gray-500">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{formatDateTime(customer.last_contact_time)}</span>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              to={`/customers/${customer.id}/communications/new`}
              className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition-colors"
              title="记录联系"
            >
              <ChatIcon className="h-3 w-3" aria-hidden="true" />
            </Link>
            <Link
              to={`/customers/${customer.id}/edit`}
              className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
              title="编辑"
            >
              <PencilIcon className="h-3 w-3" aria-hidden="true" />
            </Link>
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors"
              title="删除"
            >
              <TrashIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* 删除确认对话框 */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="删除客户"
          message="确定要将此客户移到回收站吗？"
          confirmText="删除"
          cancelText="取消"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
          danger={true}
        />
      </div>
    </div>
  );
};

export default CustomerCard; 