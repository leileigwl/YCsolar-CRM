export interface Customer {
  _id?: string;
  id?: number;
  name: string;
  contact_type: string;
  contact_info?: string;
  country: string;
  importance: '普通' | '重要' | '特别重要' | 'Normal' | 'Important' | 'VeryImportant';
  notes?: string;
  created_at: string;
  updated_at?: string;
  last_contact_time: string | null;
  deleted_at?: string | null;
  communication_count?: number;
}

export interface Communication {
  _id: string;
  customer_id: string;
  content: string;
  created_at: string;
  files?: {
    filename: string;
    originalname: string;
    path: string;
  }[];
}

export interface CustomerWithCommunications extends Customer {
  communications: Communication[];
}

export interface DeletedCustomer extends Customer {
  deleted_at: string;
}

export const getImportanceColor = (importance: string): string => {
  switch (importance) {
    case '普通':
      return 'bg-gray-100 text-gray-800';
    case '重要':
      return 'bg-orange-100 text-orange-800';
    case '特别重要':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getImportanceBadgeClass = (importance: string): string => {
  switch (importance) {
    case '普通':
      return 'bg-gray-100 text-gray-800';
    case '重要':
      return 'bg-orange-100 text-orange-800';
    case '特别重要':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 