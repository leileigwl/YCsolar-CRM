import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../utils/api';

interface CustomerFormProps {
  customerId?: string;
  initialData?: {
    name: string;
    contact_type: string;
    contact_info: string;
    country: string;
    importance: string;
    notes: string;
  };
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customerId, initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    contact_type: '',
    contact_info: '',
    country: '',
    importance: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    contact_type?: string;
    contact_info?: string;
    country?: string;
    importance?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = '客户名称不能为空';
      isValid = false;
    }

    if (!formData.contact_type.trim()) {
      newErrors.contact_type = '联系方式类型不能为空';
      isValid = false;
    }

    if (!formData.contact_info.trim()) {
      newErrors.contact_info = '联系信息不能为空';
      isValid = false;
    }

    if (!formData.country.trim()) {
      newErrors.country = '国家/地区不能为空';
      isValid = false;
    }

    if (!formData.importance) {
      newErrors.importance = '请选择客户重要程度';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit && customerId) {
        await customerAPI.updateCustomer(customerId, formData);
        setSuccess('客户信息更新成功！');
      } else {
        await customerAPI.createCustomer(formData);
        setSuccess('客户创建成功！');
        
        // 清空表单（如果是创建新客户）
        if (!isEdit) {
          setFormData({
            name: '',
            contact_type: '',
            contact_info: '',
            country: '',
            importance: '',
            notes: '',
          });
        }
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{success}</p>
        </div>
      )}
      
      <div className="shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                客户名称
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="contact_type" className="block text-sm font-medium text-gray-700">
                联系方式类型
              </label>
              <input
                type="text"
                name="contact_type"
                id="contact_type"
                placeholder="例如：电话、微信、邮箱"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.contact_type}
                onChange={handleChange}
                required
              />
              {errors.contact_type && <p className="mt-1 text-sm text-red-600">{errors.contact_type}</p>}
            </div>

            <div className="col-span-6">
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                联系信息
              </label>
              <input
                type="text"
                name="contact_info"
                id="contact_info"
                placeholder="例如：电话号码、微信号、邮箱地址"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.contact_info}
                onChange={handleChange}
                required
              />
              {errors.contact_info && <p className="mt-1 text-sm text-red-600">{errors.contact_info}</p>}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                国家/地区
              </label>
              <input
                type="text"
                name="country"
                id="country"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.country}
                onChange={handleChange}
                required
              />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="importance" className="block text-sm font-medium text-gray-700">
                客户重要程度
              </label>
              <select
                id="importance"
                name="importance"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.importance}
                onChange={handleChange}
                required
              >
                <option value="">选择重要程度</option>
                <option value="普通">普通</option>
                <option value="重要">重要</option>
                <option value="特别重要">特别重要</option>
              </select>
              {errors.importance && <p className="mt-1 text-sm text-red-600">{errors.importance}</p>}
            </div>

            <div className="col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                备注信息
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="可选的备注信息..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? '处理中...' : isEdit ? '保存更改' : '创建客户'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm; 