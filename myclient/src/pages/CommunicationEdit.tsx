import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { communicationAPI } from '../utils/api';
import { PaperClipIcon, XIcon, PhotographIcon } from '@heroicons/react/outline';

interface Communication {
  id: number;
  customer_id: number;
  user_id: number;
  content: string;
  communication_time: string;
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
  customer_name?: string;
}

interface Attachment {
  id: number;
  communication_id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

interface AttachmentPreview {
  file: File;
  preview: string;
  isImage: boolean;
}

const CommunicationEdit: React.FC = () => {
  const { id, communicationId } = useParams<{ id: string, communicationId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [communication, setCommunication] = useState<Communication | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCommunication, setLoadingCommunication] = useState(true);
  const [error, setError] = useState('');
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  
  // 加载沟通记录信息
  useEffect(() => {
    const fetchCommunication = async () => {
      try {
        const response = await communicationAPI.getCommunication(communicationId!);
        setCommunication(response.data);
        setContent(response.data.content);
      } catch (err: any) {
        setError(err.response?.data?.message || '加载沟通记录失败');
      } finally {
        setLoadingCommunication(false);
      }
    };
    
    fetchCommunication();
  }, [communicationId]);
  
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
      
      setNewAttachments(prev => [...prev, ...newFiles]);
      setAttachmentPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  // 移除新添加的附件
  const removeNewAttachment = (index: number) => {
    const preview = attachmentPreviews[index];
    if (preview.isImage) {
      URL.revokeObjectURL(preview.preview);
    }
    
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // 删除现有附件
  const deleteAttachment = async (attachmentId: number) => {
    if (!window.confirm('确定要删除此附件吗？')) {
      return;
    }
    
    try {
      await communicationAPI.deleteAttachment(communicationId!, attachmentId.toString());
      
      // 更新界面
      setCommunication(prev => {
        if (!prev) return null;
        return {
          ...prev,
          attachments: prev.attachments?.filter(a => a.id !== attachmentId) || []
        };
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '删除附件失败');
    }
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
      // 更新沟通记录内容
      await communicationAPI.updateCommunication(communicationId!, { content });
      
      // 如果有新附件，逐个添加
      for (const file of newAttachments) {
        const formData = new FormData();
        formData.append('attachment', file);
        await communicationAPI.addAttachment(communicationId!, formData);
      }
      
      // 跳转回客户详情页
      navigate(`/customers/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '保存失败');
      setLoading(false);
    }
  };
  
  if (loadingCommunication) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!communication) {
    return <div className="text-center py-8">沟通记录不存在或已被删除</div>;
  }
  
  const API_URL = 'http://localhost:5000';
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
      <h1 className="text-2xl font-bold mb-4">编辑沟通记录</h1>
      
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
          
          {/* 已有附件 */}
          {communication.attachments && communication.attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">现有附件</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {communication.attachments.map((attachment) => (
                  <div key={attachment.id} className="relative group">
                    <div className="border rounded-md overflow-hidden bg-gray-50 h-24 flex items-center justify-center">
                      {attachment.file_type.startsWith('image/') ? (
                        <a 
                          href={`${API_URL}${attachment.file_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-full w-full flex items-center justify-center"
                        >
                          <img 
                            src={`${API_URL}${attachment.file_path}`} 
                            alt={attachment.file_name} 
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ) : (
                        <a 
                          href={`${API_URL}${attachment.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center p-2 w-full h-full flex flex-col items-center justify-center"
                        >
                          <PhotographIcon className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-xs text-gray-500 truncate mt-1">{attachment.file_name}</p>
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAttachment(attachment.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                      title="删除附件"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 新添加的附件预览 */}
          {attachmentPreviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">新添加的附件</h3>
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
                      onClick={() => removeNewAttachment(index)}
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

export default CommunicationEdit; 