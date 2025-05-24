import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

interface CommunicationActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const CommunicationActions: React.FC<CommunicationActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-1">
      <button
        onClick={onEdit}
        className="p-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
        title="编辑"
      >
        <PencilIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
        title="删除"
      >
        <TrashIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </button>
    </div>
  );
};

export default CommunicationActions; 