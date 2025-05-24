import React from 'react';
import { PhoneIcon, TrashIcon, PencilAltIcon, ChatAlt2Icon, ClockIcon, UserIcon, StarIcon, ExclamationCircleIcon, ExclamationIcon, LocationMarkerIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import ConfirmDialog from './ConfirmDialog';
import { Customer } from '../types/customer';

interface CustomerDetailPanelProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
  onAddCommunication: () => void;
}

const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
  customer,
  onEdit,
  onDelete,
  onAddCommunication
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未记录';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return '日期格式错误';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case '特别重要': 
      case 'VeryImportant': 
        return '特别重要客户';
      case '重要': 
      case 'Important': 
        return '重要客户';
      case '普通': 
      case 'Normal': 
        return '普通客户';
      default: 
        return '未知';
    }
  };

  const getImportanceBadgeClass = (importance: string) => {
    switch (importance) {
      case '特别重要': 
      case 'VeryImportant': 
        return 'bg-red-100 text-red-800 border-red-200';
      case '重要': 
      case 'Important': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '普通': 
      case 'Normal': 
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case '特别重要': 
      case 'VeryImportant': 
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />;
      case '重要': 
      case 'Important': 
        return <ExclamationIcon className="h-5 w-5 text-yellow-500 mr-2" />;
      case '普通': 
      case 'Normal': 
      default: 
        return <StarIcon className="h-5 w-5 text-gray-400 mr-2" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* 客户信息头部 - 使用更引人注目的渐变背景 */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {customer.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getImportanceBadgeClass(customer.importance)}`}>
                  {getImportanceIcon(customer.importance)}
                  {getImportanceLabel(customer.importance)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <PencilAltIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
              编辑
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <TrashIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 客户详细信息 - 使用卡片组件 */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 联系信息卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <UserIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                联系信息
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{customer.contact_type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">地区</p>
                  <p className="text-sm text-gray-500">{customer.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 时间信息卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                时间信息
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">创建时间</p>
                  <p className="text-sm text-gray-500">{formatDate(customer.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">上次联系</p>
                  <p className="text-sm text-gray-500">{formatDate(customer.last_contact_time)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 备注信息卡片 */}
        {customer.notes && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                备注信息
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{customer.notes}</p>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onAddCommunication}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <ChatAlt2Icon className="h-5 w-5 mr-2" aria-hidden="true" />
            添加沟通记录
          </button>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="删除客户"
        message="确定要删除这个客户吗？所有沟通记录和附件也将被删除。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={() => {
          onDelete();
          setShowDeleteDialog(false);
        }}
        onCancel={() => setShowDeleteDialog(false)}
        danger={true}
      />
    </div>
  );
};

export default CustomerDetailPanel; 