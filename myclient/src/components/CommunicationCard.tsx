import React from 'react';
import { format } from 'date-fns';
import { 
  TrashIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  DocumentDownloadIcon,
  PencilAltIcon
} from '@heroicons/react/outline';
import { Communication } from '../types/communication';

interface CommunicationCardProps {
  communication: Communication;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentUserId: number;
}

const CommunicationCard: React.FC<CommunicationCardProps> = ({ 
  communication, 
  onEdit, 
  onDelete,
  currentUserId
}) => {
  // 格式化日期时间
  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return '日期格式错误';
    }
  };

  // 检查是否是当前用户创建的
  const isCreatedByCurrentUser = communication.user_id === currentUserId;
  
  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 确保id是数字
  const getCommunicationId = (): number => {
    if (typeof communication.id === 'number') {
      return communication.id;
    } else if (typeof communication._id === 'string') {
      // 尝试转换字符串ID为数字
      return parseInt(communication._id, 10);
    }
    // 如果都没有，返回一个安全值
    return 0;
  };

  // 获取文件URL（所有环境都使用相对路径）
  const getFileUrl = (path: string): string => {
    if (!path) return '';
    
    // 确保路径是相对路径（移除任何协议和域名）
    let normalizedPath = path;
    if (path.includes('://')) {
      // 如果包含协议，提取路径部分
      try {
        const url = new URL(path);
        normalizedPath = url.pathname;
      } catch (e) {
        // 如果解析URL失败，尝试截取路径
        const pathParts = path.split('/');
        // 尝试找到uploads部分并从那里开始
        const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
        if (uploadsIndex >= 0) {
          normalizedPath = '/' + pathParts.slice(uploadsIndex).join('/');
        }
      }
    }
    
    // 确保路径以/开头
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }

    // 在所有环境中都使用相对路径
    // 这确保了在本地开发和生产部署中都能正确访问文件
    return normalizedPath;
  };

  // 检查文件是否可以在浏览器中查看
  const isViewableInBrowser = (fileType: string, fileName: string): boolean => {
    // 图片类型总是在浏览器中查看
    if (fileType.startsWith('image/')) {
      return true;
    }
    
    // PDF文件可以在浏览器中查看
    if (fileType === 'application/pdf') {
      return true;
    }
    
    // 文本文件可以在浏览器中查看
    if (fileType === 'text/plain' || 
        fileType === 'text/html' || 
        fileType === 'text/css' ||
        fileType === 'text/javascript') {
      return true;
    }
    
    // Office文档总是下载(不在浏览器中查看)
    if (fileType.includes('word') || 
        fileType.includes('excel') || 
        fileType.includes('spreadsheet') ||
        fileType.includes('presentation') ||
        fileType.includes('powerpoint')) {
      return false;
    }
    
    // 根据文件扩展名判断
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'txt' || ext === 'pdf' || ext === 'html' || ext === 'htm') {
      return true;
    }
    
    if (ext === 'doc' || ext === 'docx' || 
        ext === 'xls' || ext === 'xlsx' || 
        ext === 'ppt' || ext === 'pptx' ||
        ext === 'csv') {
      return false;
    }
    
    // 默认情况下不在浏览器中查看
    return false;
  };

  const getAttachmentIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    } else if (fileType.includes('pdf')) {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    } else {
      return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
        {/* 沟通记录头部 */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="inline-flex items-center">
                <UserIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm font-medium text-gray-800">{communication.user_name || '系统'}</span>
              </div>
              <span className="mx-2 text-gray-400">•</span>
              <div className="inline-flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">{formatDateTime(communication.communication_time)}</span>
              </div>
            </div>
          </div>

          {isCreatedByCurrentUser && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(getCommunicationId())}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
                title="编辑"
              >
                <PencilAltIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                编辑
              </button>
              <button
                onClick={() => onDelete(getCommunicationId())}
                className="inline-flex items-center px-2.5 py-1.5 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                title="删除"
              >
                <TrashIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                删除
              </button>
            </div>
          )}
        </div>

        {/* 沟通内容 */}
        <div className="p-5 bg-white">
          <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {communication.content}
          </div>

          {/* 附件列表 */}
          {communication.attachments && communication.attachments.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">附件</h4>
              <div className="space-y-2">
                {communication.attachments.map((attachment, index) => {
                  const viewable = isViewableInBrowser(attachment.file_type, attachment.file_name);
                  
                  // 获取文件URL（相对路径）
                  const fileUrl = getFileUrl(attachment.file_path);
                  
                  return (
                    <a
                      key={attachment.id || index}
                      href={fileUrl}
                      download={viewable ? undefined : attachment.file_name}
                      target={viewable ? "_blank" : undefined}
                      className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 group"
                      onClick={(e) => {
                        // 可查看的文件类型使用新窗口打开
                        if (viewable) {
                          e.preventDefault();
                          window.open(fileUrl, '_blank');
                        }
                        e.stopPropagation(); // 防止冒泡
                      }} rel="noreferrer"
                    >
                      <div className="flex-shrink-0">
                        {getAttachmentIcon(attachment.file_type)}
                      </div>
                      <div className="ml-3 flex-grow min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {attachment.file_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(attachment.file_size)}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <DocumentDownloadIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCard; 