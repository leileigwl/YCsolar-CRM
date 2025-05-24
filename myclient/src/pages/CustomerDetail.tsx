import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import CustomerDetailPanel from '../components/CustomerDetailPanel';
import CommunicationCard from '../components/CommunicationCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { Customer } from '../types/customer';
import { Communication } from '../types/communication';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [communicationToDelete, setCommunicationToDelete] = useState<number | null>(null);
  const [showCustomerDeleteDialog, setShowCustomerDeleteDialog] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerResponse, communicationsResponse] = await Promise.all([
          customerAPI.getCustomer(id!),
          communicationAPI.getCustomerCommunications(id!)
        ]);
        
        setCustomer(customerResponse.data);
        setCommunications(communicationsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // 删除沟通记录
  const handleDeleteCommunication = async (communicationId: number) => {
    setCommunicationToDelete(communicationId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCommunication = async () => {
    if (communicationToDelete) {
      try {
        await communicationAPI.deleteCommunication(communicationToDelete.toString());
        setCommunications(prev => prev.filter(comm => comm.id !== communicationToDelete));
      } catch (err: any) {
        setError(err.response?.data?.message || '删除沟通记录失败');
      } finally {
        setShowDeleteDialog(false);
        setCommunicationToDelete(null);
      }
    }
  };

  // 删除客户
  const handleDeleteCustomer = async () => {
    setShowCustomerDeleteDialog(true);
  };
  
  const confirmDeleteCustomer = async () => {
    try {
      await customerAPI.deleteCustomer(id!);
      navigate('/customers');
    } catch (err: any) {
      setError(err.response?.data?.message || '删除客户失败');
    } finally {
      setShowCustomerDeleteDialog(false);
    }
  };

  // 编辑客户
  const handleEditCustomer = () => {
    navigate(`/customers/${id}/edit`);
  };

  // 添加沟通记录
  const handleAddCommunication = () => {
    navigate(`/customers/${id}/communications/new`);
  };

  // 编辑沟通记录
  const handleEditCommunication = (communicationId: number) => {
    navigate(`/customers/${id}/communications/${communicationId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
        <p className="font-bold">发生错误</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-xl text-gray-600">客户不存在或已被删除</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 客户详情面板 */}
      <CustomerDetailPanel 
        customer={customer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onAddCommunication={handleAddCommunication}
      />

      {/* 沟通记录部分 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">沟通记录历史</h3>
          </div>
        </div>
        
        <div className="p-6 removeBlueButtons">
          {communications.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无沟通记录</h3>
              <p className="mt-1 text-sm text-gray-500">开始记录与客户的沟通内容以便追踪</p>
              <div className="mt-6">
                <button
                  onClick={handleAddCommunication}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  添加首条沟通记录
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-gray-200">
              {communications.map((comm) => (
                <CommunicationCard
                  key={comm.id}
                  communication={comm}
                  onEdit={handleEditCommunication}
                  onDelete={handleDeleteCommunication}
                  currentUserId={user ? user.id : 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 确认删除沟通记录的对话框 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="删除沟通记录"
        message="确定要删除这条沟通记录吗？"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteCommunication}
        onCancel={() => {
          setShowDeleteDialog(false);
          setCommunicationToDelete(null);
        }}
        danger={true}
      />

      {/* 确认删除客户的对话框 */}
      <ConfirmDialog
        isOpen={showCustomerDeleteDialog}
        title="删除客户"
        message="确定要删除这个客户吗？所有沟通记录和附件也将被删除。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteCustomer}
        onCancel={() => setShowCustomerDeleteDialog(false)}
        danger={true}
      />
    </div>
  );
};

export default CustomerDetail; 