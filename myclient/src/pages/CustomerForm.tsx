import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { 
  UserIcon, 
  ChatAlt2Icon, 
  GlobeAltIcon, 
  ExclamationIcon, 
  DocumentTextIcon, 
  PaperClipIcon, 
  XIcon, 
  PhotographIcon,
  SaveIcon,
  ArrowLeftIcon
} from '@heroicons/react/outline';

interface CustomerFormData {
  name: string;
  contact_type: 'WeChat' | 'WhatsApp';
  contact_info: string;
  country: string;
  importance: 'Normal' | 'Important' | 'VeryImportant';
  notes: string;
}

interface AttachmentPreview {
  file: File;
  preview: string;
  isImage: boolean;
}



const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    contact_type: 'WeChat',
    contact_info: '',
    country: '',
    importance: 'Normal',
    notes: ''
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          const response = await customerAPI.getCustomer(id);
          const customerData = response.data;
          
          // 确保重要程度值正确映射
          setFormData({
            ...customerData,
            importance: customerData.importance || 'Normal'
          });
        } catch (err: any) {
          setError(err.response?.data?.message || '加载客户数据失败');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCustomer();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await customerAPI.updateCustomer(id, formData);
        navigate('/customers');
      } else {
        // 创建客户
        const response = await customerAPI.createCustomer(formData);
        const customerId = response.data.id;
        
        // 检查是否有沟通内容或附件需要创建沟通记录
        if (formData.contact_info || attachments.length > 0) {
          // 创建FormData对象
          const commFormData = new FormData();
          commFormData.append('customer_id', customerId.toString());
          
          // 设置沟通内容
          if (formData.contact_info) {
            // 如果有填写沟通内容，则使用用户填写的内容
            commFormData.append('content', formData.contact_info);
          } else {
            // 否则使用默认的附件上传信息
            commFormData.append('content', `初次添加客户 ${formData.name}，上传了 ${attachments.length} 个文件。`);
          }
          
          // 格式化日期为MySQL兼容格式 YYYY-MM-DD HH:MM:SS
          const now = new Date();
          const dateStr = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0') + ' ' + 
                         String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0') + ':' + 
                         String(now.getSeconds()).padStart(2, '0');
          
          commFormData.append('communication_time', dateStr);
          
          // 添加附件
          attachments.forEach(file => {
            commFormData.append('attachments', file);
          });
          
          // 提交沟通记录
          await communicationAPI.createCommunication(commFormData);
          
          // 更新客户最后联系时间
          await customerAPI.updateLastContactTime(customerId.toString());
        }
        
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '保存失败');
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white shadow overflow-hidden sm:rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-800">{isEditMode ? '编辑客户' : '添加客户'}</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-medium">保存失败</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="客户姓名"
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md py-3 text-base"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="contact_type" className="block text-sm font-medium text-gray-700">联系方式</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ChatAlt2Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  name="contact_type"
                  id="contact_type"
                  required
                  value={formData.contact_type}
                  onChange={handleChange}
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md py-3 text-base"
                >
                  <option value="WeChat">WeChat</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">国家/地区</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="例如：中国、美国、欧洲"
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md py-3 text-base"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="importance" className="block text-sm font-medium text-gray-700">重要程度</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ExclamationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  name="importance"
                  id="importance"
                  required
                  value={formData.importance}
                  onChange={handleChange}
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md py-3 text-base"
                >
                  <option value="Normal">普通</option>
                  <option value="Important">重要</option>
                  <option value="VeryImportant">特别重要</option>
                </select>
              </div>
            </div>
            
            {!isEditMode && (
              <div className="sm:col-span-2">
                <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">沟通内容</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  name="contact_info"
                  id="contact_info"
                  rows={6}
                  required
                  value={formData.contact_info}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md text-base p-3 align-top"
                  placeholder="记录首次与客户沟通的详细内容..."
                ></textarea>
              </div>
              </div>
            )}
            
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">备注（可选）</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="notes"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="客户的相关信息..."
                  className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-2 border-gray-200 rounded-md py-3 text-base"
                />
              </div>
            </div>
          </div>
        </div>
        
        {!isEditMode && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">初次联系文件（可选）</h2>
            </div>
            
            {/* 附件预览区域 */}
            {attachmentPreviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">已选文件</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PaperClipIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                选择文件
              </button>
              <p className="mt-2 text-sm text-gray-500">支持图片、PDF、Word、Excel等格式。上传的文件会作为首次沟通记录保存。</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-white py-3 px-6 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            返回
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </>
            ) : (
              <>
                <SaveIcon className="h-5 w-5 mr-2" />
                保存
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm; 