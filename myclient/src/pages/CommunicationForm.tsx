import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { PaperClipIcon, XIcon, PhotographIcon } from '@heroicons/react/outline';

interface Customer {
  id: number;
  name: string;
  contact_type: string;
  contact_info: string;
}

interface AttachmentPreview {
  file: File;
  preview: string;
  isImage: boolean;
}

const CommunicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  
  // 加载客户信息
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await customerAPI.getCustomer(id!);
        setCustomer(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '加载客户数据失败');
      } finally {
        setLoadingCustomer(false);
      }
    };
    
    fetchCustomer();
  }, [id]);
  
  // 处理附件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // 创建文件预览
      const newPreviews = newFiles.map(file => {
        const isImage = file.type.startsWith('image/');
        return {
          file,
          preview: isImage ? URL.createObjectURL(file) : '',
          isImage
        };
      });
      
      setAttachments(prev => [...prev, ...newFiles]);
      setAttachmentPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  // 移除附件
  const removeAttachment = (index: number) => {
    const preview = attachmentPreviews[index];
    if (preview.isImage) {
      URL.revokeObjectURL(preview.preview);
    }
    
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('请输入沟通内容');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('customer_id', id!);
      formData.append('content', content);
      
      // 格式化日期为MySQL兼容格式 YYYY-MM-DD HH:MM:SS，使用本地时间而非UTC
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      const dateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      formData.append('communication_time', dateStr);
      
      // 添加附件
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      // 提交沟通记录
      const response = await communicationAPI.createCommunication(formData);
      
      // 只有在成功后才更新UI和跳转
      if (response && response.data) {
        try {
          // 更新客户最后联系时间
          await customerAPI.updateLastContactTime(id!);
        } catch (contactErr: any) {
          console.error("更新最后联系时间失败:", contactErr);
          // 继续执行，因为沟通记录已经保存成功
        }
        
        // 跳转到客户详情页
        navigate(`/customers/${id}`);
      }
    } catch (err: any) {
      console.error("保存沟通记录失败:", err);
      setError(err.response?.data?.message || '保存失败');
      setLoading(false);
    }
  };
  
  if (loadingCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!customer) {
    return <div className="text-center py-8">客户不存在或已被删除</div>;
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
      <h1 className="text-2xl font-bold mb-4">记录与 {customer.name} 的沟通</h1>
     
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              沟通内容
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                name="content"
                rows={6}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="输入与客户的沟通内容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* 附件预览区域 */}
          {attachmentPreviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">附件</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {attachmentPreviews.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="border rounded-md overflow-hidden bg-gray-50 h-24 flex items-center justify-center">
                      {item.isImage ? (
                        <img 
                          src={item.preview} 
                          alt={item.file.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <PhotographIcon className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-xs text-gray-500 truncate mt-1">{item.file.name}</p>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                      title="移除附件"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PaperClipIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                添加附件
              </button>
              <span className="ml-2 text-xs text-gray-500">支持图片、PDF、Word、Excel等格式</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/customers/${id}`)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommunicationForm; 